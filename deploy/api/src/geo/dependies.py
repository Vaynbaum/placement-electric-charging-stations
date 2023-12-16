from fastapi import Depends

from src.dependies import *
from src.geo.service import GeoService
from src.services import *


def create_geo_service(
    uow: IUnitOfWork = Depends(create_uow),
):
    return GeoService(uow)
