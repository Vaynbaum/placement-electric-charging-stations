from shapely.geometry import shape
from shapely.wkb import loads

from src.geo.schemas import *
from src.infrastructure.schemas import EVStationSchema
from src.mappers import SimpleMapper


class EVStationMapper(SimpleMapper[EVStationSchema]):
    def __init__(self):
        super().__init__(EVStationSchema)

    def create_from_database(self, ev) -> EVStationSchema:
        ev_procced = super().create_from_database(ev)
        ev_procced.center = shape(loads(ev.location.data)).__geo_interface__
        return ev_procced

