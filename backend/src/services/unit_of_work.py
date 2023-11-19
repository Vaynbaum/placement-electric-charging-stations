from abc import ABC, abstractmethod
from typing import Callable
from sqlalchemy.ext.asyncio import AsyncSession

from src.geo.repositories import *
from src.infrastructure.repositories import *


class IUnitOfWork(ABC):
    cities: ICityRepository
    ev_chargers: IEVStationRepository

    @abstractmethod
    async def __aenter__(self):
        pass

    @abstractmethod
    async def __aexit__(self):
        pass

    @abstractmethod
    async def commit(self):
        raise NotImplementedError()

    @abstractmethod
    async def rollback(self):
        raise NotImplementedError()


class UnitOfWork(IUnitOfWork):
    def __init__(self, session_maker: Callable[[], AsyncSession]):
        self.__session_maker = session_maker

    async def __aenter__(self):
        self.__session: AsyncSession = self.__session_maker()
        self.cities = CityRepository(self.__session)
        self.ev_chargers = EVStationRepository(self.__session)

        return await super().__aenter__()

    async def __aexit__(self, *args):
        await self.rollback()
        await self.__session.close()

    async def commit(self):
        await self.__session.commit()

    async def rollback(self):
        await self.__session.rollback()
