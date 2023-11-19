from shapely.geometry import shape
from shapely.wkb import loads

from src.geo.schemas import *
from src.mappers import SimpleMapper


class CityMapper(SimpleMapper[CitySchema]):
    def __init__(self):
        super().__init__(CitySchema)

    def create_from_database(self, city) -> CitySchema:
        city_procced = super().create_from_database(city)
        city_procced.center = shape(loads(city.location.data)).__geo_interface__
        city_procced.border = shape(loads(city.geometry.data)).__geo_interface__
        return city_procced


class RegionMapper(SimpleMapper[RegionSchema]):
    def __init__(self):
        super().__init__(RegionSchema)

    def create_from_database(self, region) -> RegionSchema:
        region_procced = super().create_from_database(region)
        region_procced.center = shape(loads(region.location.data)).__geo_interface__
        region_procced.border = shape(loads(region.geometry.data)).__geo_interface__
        return region_procced
