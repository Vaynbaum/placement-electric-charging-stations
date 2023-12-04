from typing import List

from src.database.exceptions import GetAllItemsException
from src.exceptions import AnyServiceException
from src.infrastructure.mappers import EVStationMapper
from src.infrastructure.phrases import EVSTATIONS_NOT_FOUND
from src.infrastructure.schemas import EVStationSchema
from src.services.unit_of_work import IUnitOfWork
from src.utils import process_items_from_database


class InfrastructureService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all_ev_chargers(
        self, city_id: int | None, region_id: int | None
    ) -> List[EVStationSchema]:
        async with self.__uow:
            try:
                ev_stations = await self.__uow.ev_chargers.get_all(city_id, region_id)
                return process_items_from_database(
                    ev_stations, EVSTATIONS_NOT_FOUND, EVStationMapper()
                )
            except GetAllItemsException as e:
                raise AnyServiceException(e.message) from e
