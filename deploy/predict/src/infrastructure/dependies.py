from fastapi import Depends

from src.dependies import *
from src.infrastructure.service import InfrastructureService
from src.services import *


def create_infrastructure_service(
    uow: IUnitOfWork = Depends(create_uow),
):
    return InfrastructureService(uow)
