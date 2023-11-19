from typing import Annotated
from fastapi import APIRouter, Depends, Query

# from fastapi_cache.decorator import cache

from src.const import *
from src.geo.dependies import create_geo_service
from src.geo.schemas import CitySchema
from src.geo.service import GeoService
from src.schemas.response_items import ResponseItemsSchema
from src.utils import IgnoredArgCache


router = APIRouter(prefix="/geo", tags=["Geo"])


@router.get("/cities/all", response_model=ResponseItemsSchema[CitySchema])
# @cache(expire=EXPIRES_HOUR_CACHE_ON_SECONDS)
async def get_all_cities(
    is_top: bool = Query(default=None),
    substr: str = Query(default=None),
    limit: int = Query(default=DEFAULT_LIMIT, ge=VALUE_NOT_LESS, le=DEFAULT_LIMIT),
    offset: int = Query(default=DEFAULT_OFFSET, ge=VALUE_NOT_LESS),
    geo_service: Annotated[GeoService, IgnoredArgCache] = Depends(create_geo_service),
):
    return await geo_service.get_all_cities(offset, limit, substr, is_top)
