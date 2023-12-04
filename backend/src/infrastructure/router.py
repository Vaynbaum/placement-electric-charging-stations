from typing import Annotated
from fastapi import APIRouter, Depends, Query

# from fastapi_cache.decorator import cache

from src.const import *
from src.geo.dependies import create_geo_service
from src.geo.service import GeoService
from src.infrastructure.dependies import create_infrastructure_service
from src.infrastructure.schemas import EVStationSchema
from src.infrastructure.service import InfrastructureService
from src.schemas.response_items import ResponseItemsSchema
from src.utils import IgnoredArgCache


router = APIRouter(prefix="/infrastructure", tags=["Infrastructure"])


@router.get("/ev_chargers/all", response_model=ResponseItemsSchema[EVStationSchema])
# @cache(expire=EXPIRES_HOUR_CACHE_ON_SECONDS)
async def get_all_ev_chargers(
    city_id: int = Query(default=None, ge=1),
    region_id: int = Query(default=None, ge=1),
    infrastructure_service: Annotated[InfrastructureService, IgnoredArgCache] = Depends(
        create_infrastructure_service
    ),
):
    return await infrastructure_service.get_all_ev_chargers(city_id, region_id)
