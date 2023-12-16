from typing import List

from src.database.exceptions import GetAllItemsException
from src.exceptions import AnyServiceException
from src.geo.mappers import CityMapper
from src.geo.phrases import CITIES_NOT_FOUND
from src.geo.schemas import CitySchema
from src.services.unit_of_work import IUnitOfWork
from src.utils import process_items_from_database


class GeoService:
    def __init__(self, uow: IUnitOfWork):
        self.__uow = uow

    async def get_all_cities(
        self, offset: int, limit: int, substr: str | None, is_top: bool | None
    ) -> List[CitySchema]:
        async with self.__uow:
            try:
                cities = await self.__uow.cities.get_all(offset, limit, substr, is_top)
                return process_items_from_database(
                    cities, CITIES_NOT_FOUND, CityMapper()
                )
            except GetAllItemsException as e:
                raise AnyServiceException(e.message) from e
