from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.database.models import *
from src.database.exceptions import *
from src.database.repositories.generic import GenericRepository
from src.database.repositories.generic_sqlalchemy import GenericSqlRepository


class IEVStationRepository(GenericRepository[EVStation], ABC):
    @abstractmethod
    async def get_all(
        self, city_id: int | None, region_id: int | None
    ) -> List[EVStation]:
        raise NotImplementedError()


class EVStationRepository(GenericSqlRepository[EVStation], IEVStationRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, EVStation)

    async def get_all(
        self, city_id: int | None, region_id: int | None
    ) -> List[EVStation]:
        stmt = self._construct_statement_get_all(city_id=city_id, region_id=region_id)
        return await self._execute_statement_get_all(stmt)
