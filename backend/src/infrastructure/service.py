from typing import List
import osmnx as ox
from pyproj import Proj, transform
import re
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from shapely.ops import transform
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import pyproj

from src.database.exceptions import GetAllItemsException
from src.exceptions import AnyServiceException
from src.geo.phrases import CITY_NOT_FOUND
from src.infrastructure.const import ALL_HOURS, GRID_SIZE
from src.infrastructure.mappers import *
from src.infrastructure.phrases import *
from src.infrastructure.schemas import *
from src.schemas.response_items import ResponseItemsSchema
from src.services.unit_of_work import IUnitOfWork
from src.utils import check_exist_items, process_items_from_database


class InfrastructureService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all_parkings(
        self, city_id: int | None
    ) -> ResponseItemsSchema[EVStationSchema]:
        async with self.__uow:
            try:
                parkings = await self.__uow.parkings.get_all(city_id=city_id)
                return process_items_from_database(
                    parkings, PARKINGS_NOT_FOUND, ParkingMapper()
                )
            except GetAllItemsException as e:
                raise AnyServiceException(e.message) from e

    async def get_all_ev_chargers(
        self, city_id: int | None, region_id: int | None
    ) -> ResponseItemsSchema[EVStationSchema]:
        async with self.__uow:
            try:
                ev_stations = await self.__uow.ev_chargers.get_all(city_id, region_id)
                return process_items_from_database(
                    ev_stations, EVSTATIONS_NOT_FOUND, EVStationMapper()
                )
            except GetAllItemsException as e:
                raise AnyServiceException(e.message) from e

    async def get_ev_chargers_predict(
        self, city_id: int, hour: int
    ) -> List[EVStationPredictSchema]:
        async with self.__uow:
            try:
                city = await self.__get_city(city_id)
                populations = await self.__get_populations(city_id)
                default_ev_load = await self.__get_default_ev_load(populations)
                parkings, is_exist_parks = await self.__proccess_parking(city_id)
                exist_evs, is_exist_evs = await self.__proccess_exist_evs(city_id)

                city_proj, geometry_cut = self.__get_city_from_osm(city)
                transformer = self.__create_transformer(city_proj)
                polylist = self.__proccess_geoms(geometry_cut.geoms, transformer)

                if is_exist_parks:
                    parkings = self.__proccess_parkins(parkings)
                    polylist = self.__proccess_stations_to_park(polylist, parkings)

                if is_exist_evs:
                    polylist = self.__classification_evs(
                        polylist, exist_evs, default_ev_load
                    )

                clusters = self.__group_evs(
                    polylist, populations, is_exist_evs, default_ev_load
                )
                clusters = self.alg(clusters, hour)

                return self.__proccess_stations(clusters, parkings, is_exist_parks)
            except GetAllItemsException as e:
                raise AnyServiceException(e.message) from e

    def alg(self, clusters: dict[int, ClusterS], hour: int):
        f = True
        while f:
            f = False
            for cluster in clusters.values():
                cluster.pops = 0
                min = 25
                min_p = None
                for poly in cluster.items:
                    if not poly.is_deleted:
                        cluster.pops += poly.pop

                for poly in cluster.items:
                    if not poly.is_deleted:
                        poly.load = cluster.load * poly.pop / cluster.pops

                        if poly.can_delete:
                            if poly.load < min and poly.load < hour:
                                min = poly.load
                                min_p = poly
                if min_p:
                    min_p.is_deleted = True
                    f = True
        return clusters

    async def __proccess_parking(self, city_id: int):
        parkings = await self.__uow.parkings.get_all(city_id=city_id)
        return parkings, len(parkings) > 0

    async def __proccess_exist_evs(self, city_id: int):
        exist_evs = await self.__uow.ev_chargers.get_all(city_id=city_id)
        return exist_evs, len(exist_evs) > 0

    def __get_city_from_osm(self, city):
        city_osm = ox.geocode_to_gdf(city.display_name, which_result=1)
        city_proj = ox.project_gdf(city_osm)
        geometry = city_proj["geometry"].iloc[0]
        try:
            geometry_cut = ox.utils_geo._quadrat_cut_geometry(
                geometry, quadrat_width=GRID_SIZE
            )
            return city_proj, geometry_cut
        except Exception as e:
            raise AnyServiceException(GEOMS_CITY) from e

    async def __get_city(self, city_id: int):
        city = await self.__uow.cities.get_by_id(city_id)
        check_exist_items(city, CITY_NOT_FOUND)
        return city

    async def __get_populations(self, city_id: int):
        ps = []
        populations = await self.__uow.populations.get_all(city_id=city_id)
        for p in populations:
            loc = to_shape(p.geometry)
            pop = PopulationPS(value=p.value, poly=loc)
            ps.append(pop)
        return ps

    async def __get_default_ev_load(self, populations):
        pop_city = self.__sum_pop_city(populations)
        return await self.__uow.ev_loads.get_one(pop_city)

    def __group_evs(
        self,
        polylist: list[PolyS],
        populations: list[PopulationPS],
        is_exist_evs: bool,
        default_ev_load: EVLoad,
    ):
        clusters = {}
        for p in polylist:
            f = False
            for population in populations:
                if population.poly.intersects(p.poly):
                    p.pop = population.value
                    f = True
                    break
            if f:
                cluster: ClusterS | None = clusters.get(p.cluster, None)

                if cluster is None:
                    cluster = ClusterS(items=[p])
                    clusters[p.cluster] = cluster
                else:
                    cluster.items.append(p)

                if not is_exist_evs:
                    cluster.load = default_ev_load.value
                elif not p.can_delete:
                    cluster.load = p.load
        return clusters

    def __proccess_geoms(self, geoms: list, transformer):
        polylist = []
        for p in geoms:
            p_utm = transform(transformer.transform, p)
            poly = PolyS(poly=p_utm)
            polylist.append(poly)
        return polylist

    def __create_transformer(self, city_proj):
        result = re.findall(r"\+(.*?)=([\w\d]+)", city_proj.crs.srs)
        data = {}
        for key, value in result:
            data[key] = value

        target = Proj(
            proj=data.get("proj"), zone=int(data.get("zone")), ellps=data.get("ellps")
        )
        source = Proj(init="epsg:4326")
        return pyproj.Transformer.from_crs(target.crs, source.crs, always_xy=True)

    def __proccess_stations(
        self, clusters: dict[int, ClusterS], parkings: list[Point], is_exist_parks: bool
    ):
        stations = []
        for cluster in clusters.values():
            for p in cluster.items:
                if not p.can_delete or p.is_deleted:
                    continue
                poly = p.poly
                if is_exist_parks:
                    for park in parkings:
                        if poly.contains(park):
                            coord = Coordinate(latitude=park.y, longitude=park.x)
                else:
                    coord = Coordinate(
                        latitude=poly.centroid.y, longitude=poly.centroid.x
                    )
                s = EVStationPredictSchema(
                    coord=coord,
                    value=round(p.load, 1),
                )
                stations.append(s)
        return stations

    def __proccess_stations_to_park(self, polies: list[PolyS], parkings: list[Point]):
        polylist = []
        drawed_pols = []

        for p in polies:
            poly = p.poly
            for park in parkings:
                if poly.contains(park):
                    f = True
                    for dp in drawed_pols:
                        if dp.contains(poly.centroid):
                            f = False
                    if f:
                        polylist.append(p)
                        drawed_pols.append(poly)
                    break
        return polylist

    def __proccess_parkins(self, parkings):
        ps = []
        for p in parkings:
            loc = to_shape(p.location)
            ps.append(Point(loc.x, loc.y))
        return ps

    def __classification_evs(
        self, polylist: list[PolyS], exist_evs: list[EVStation], default_ev_load: EVLoad
    ):
        classified_points = []
        for i in range(len(exist_evs)):
            ev = exist_evs[i]
            loc = to_shape(ev.location)
            classified_points.append((loc.x, loc.y, i))

        unclassified_points = []
        for p in polylist:
            poly = p.poly
            unclassified_points.append((poly.centroid.x, poly.centroid.y))

        x_train = np.array([point[:2] for point in classified_points])
        y_train = np.array([point[2] for point in classified_points])
        x_test = np.array(unclassified_points)

        knn = KNeighborsClassifier(n_neighbors=1)
        knn.fit(x_train, y_train)
        predicted_labels = knn.predict(x_test)

        for poly, label in zip(polylist, predicted_labels):
            poly.cluster = label
            poly.can_delete = True

        for i in range(len(exist_evs)):
            ev = exist_evs[i]
            loc = to_shape(ev.location)
            e = PolyS(
                load=ev.use_time if ev.use_time else default_ev_load.value,
                poly=loc,
                cluster=i,
                can_delete=False,
            )
            polylist.append(e)
        return polylist

    def __sum_pop_city(self, populations: list[Population]):
        value = 0
        for population in populations:
            value += population.value
        return value
