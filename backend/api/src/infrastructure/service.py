from src.database.exceptions import GetAllItemsException
from src.exceptions import AnyServiceException
from src.infrastructure.const import *
from src.infrastructure.mappers import *
from src.infrastructure.phrases import *
from src.infrastructure.schemas import *
from src.schemas.response_items import ResponseItemsSchema
from src.services.unit_of_work import IUnitOfWork
from src.utils import process_items_from_database


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
