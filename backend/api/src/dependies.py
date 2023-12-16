from src.database.base import AsyncSessionMaker
from src.services.unit_of_work import UnitOfWork


def create_uow():
    return UnitOfWork(AsyncSessionMaker)
