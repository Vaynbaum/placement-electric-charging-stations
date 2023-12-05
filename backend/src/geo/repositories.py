from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy.orm import selectinload

from src.database.models import *
from src.database.exceptions import *
from src.database.repositories.generic import GenericRepository
from src.database.repositories.generic_sqlalchemy import GenericSqlRepository


class ICityRepository(GenericRepository[City], ABC):
    @abstractmethod
    async def get_all(
        self,
        offset: int,
        limit: int,
        substr: str | None,
        is_top: bool | None,
    ) -> List[City]:
        raise NotImplementedError()


class CityRepository(GenericSqlRepository[City], ICityRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, City)

    async def get_all(
        self,
        offset: int,
        limit: int,
        substr: str | None,
        is_top: bool | None,
    ) -> List[City]:
        stmt = self._construct_statement_get_all(offset, limit, is_top=is_top)
        stmt = stmt.options(selectinload(City.region))
        stmt = self._add_substr_to_stmt(stmt, City.name, substr)
        stmt = stmt.order_by(City.name)
        return await self._execute_statement_get_all(stmt)


class IPopulationRepository(GenericRepository[Population], ABC):
    pass

    
class PopulationRepository(GenericSqlRepository[Population], IPopulationRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Population)
