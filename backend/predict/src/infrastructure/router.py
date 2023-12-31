from datetime import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, Query
from fastapi_cache.decorator import cache

from src.const import *
from src.infrastructure.const import *
from src.infrastructure.dependies import create_infrastructure_service
from src.infrastructure.schemas import *
from src.infrastructure.service import InfrastructureService
from src.utils import IgnoredArgCache


router = APIRouter(prefix="/infrastructure", tags=["Infrastructure"])


@router.get(f"{EV}/predict", response_model=List[EVStationPredictSchema])
@cache(expire=EXPIRES_HOUR_CACHE_ON_SECONDS)
async def get_ev_chargers_predict(
    city_id: int = Query(default=None, ge=1),
    hour: int = Query(default=DEFAULT_HOUR, ge=0, le=ALL_HOURS),
    year: int = Query(default=datetime.now().year, ge=datetime.now().year, le=MAX_YEAR),
    power: int = Query(default=DEFAULT_POWER, ge=0),
    cost_service: float = Query(default=DEFAULT_COST_SERVICE, ge=0),
    cost_ev: float = Query(default=DEFAULT_COST_EV, ge=0),
    time_charge_hour: float = Query(default=DEFAULT_CHARGE_HOUR, ge=0),
    infrastructure_service: Annotated[InfrastructureService, IgnoredArgCache] = Depends(
        create_infrastructure_service
    ),
):
    return await infrastructure_service.get_ev_chargers_predict(
        city_id, hour, year, power, cost_service, cost_ev, time_charge_hour
    )
