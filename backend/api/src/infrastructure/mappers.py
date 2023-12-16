from shapely.geometry import shape
from shapely.wkb import loads

from src.geo.schemas import *
from src.infrastructure.schemas import *
from src.mappers import SimpleMapper


class EVStationMapper(SimpleMapper[EVStationSchema]):
    def __init__(self):
        super().__init__(EVStationSchema)

    def create_from_database(self, ev) -> EVStationSchema:
        ev_procced = super().create_from_database(ev)
        ev_procced.center = shape(loads(ev.location.data)).__geo_interface__
        return ev_procced


class ParkingMapper(SimpleMapper[ParkingSchema]):
    def __init__(self):
        super().__init__(ParkingSchema)

    def create_from_database(self, ev) -> ParkingSchema:
        parking_procced = super().create_from_database(ev)
        parking_procced.center = shape(loads(ev.location.data)).__geo_interface__
        return parking_procced
