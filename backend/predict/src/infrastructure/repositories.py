from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from src.database.models import *
from src.database.exceptions import *
from src.database.repositories.generic import GenericRepository
from src.database.repositories.generic_sqlalchemy import GenericSqlRepository


class IEVStationRepository(GenericRepository[EVStation], ABC):
    @abstractmethod
    async def get_all(
        self, city_id: int | None = None, region_id: int | None = None
    ) -> List[EVStation]:
        raise NotImplementedError()


class EVStationRepository(GenericSqlRepository[EVStation], IEVStationRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, EVStation)

    async def get_all(
        self, city_id: int | None = None, region_id: int | None = None
    ) -> List[EVStation]:
        stmt = self._construct_statement_get_all(city_id=city_id, region_id=region_id)
        return await self._execute_statement_get_all(stmt)


class IParkingRepository(GenericRepository[Parking], ABC):
    pass


class ParkingRepository(GenericSqlRepository[Parking], IParkingRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Parking)


class IEVLoadRepository(GenericRepository[EVLoad], ABC):
    @abstractmethod
    async def get_one(self, value: int) -> Optional[EVLoad]:
        raise NotImplementedError()


class EVLoadRepository(GenericSqlRepository[EVLoad], IEVLoadRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, EVLoad)

    async def get_one(self, value: int) -> Optional[EVLoad]:
        stmt = self._construct_statement_get_one()
        stmt = stmt.where(EVLoad.min_pop <= value, EVLoad.max_pop > value)
        return await self._execute_statement_get_one(stmt)
