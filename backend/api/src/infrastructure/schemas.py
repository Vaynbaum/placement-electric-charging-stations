from typing import Any, List
from pydantic import BaseModel, Field
from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from pydantic_extra_types.coordinate import Coordinate

from src.database.models import *


class EVStationSchema(sqlalchemy_to_pydantic(EVStation, exclude=["location"])):
    center: dict | None = None
    city_id: int | None = None
    region_id: int | None = None
    сonnections: dict | None = None
    address: dict | None = None
    operator: dict | None = None
    data_provider: dict | None = None
    usage_type: dict | None = None
    status_type: dict | None = None
    submission_status_type: dict | None = None
    number_points: int | None = None
    external_id: dict | None = None
    cost: str | None = None
    use_time: float | None = None

    class Config:
        from_attributes = True


class EVStationPredictSchema(BaseModel):
    coord: Coordinate
    value: float
    pay_back: float | None = None
    count_cars: int


class ParkingSchema(sqlalchemy_to_pydantic(Parking, exclude=["location"])):
    city_id: int | None = None
    address: str | None = None
    description: str | None = None
    center: dict | None = None

    class Config:
        from_attributes = True


class PopulationPS(BaseModel):
    value: float
    poly: Any


class PolyS(BaseModel):
    poly: Any
    load: float = Field(default=0)
    cluster: int = Field(default=1)
    can_delete: bool = Field(default=True)
    is_exist: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
    pop: float = Field(default=0)


class ClusterS(BaseModel):
    items: List[PolyS] = []
    pops: float = Field(default=0)
    load: float = Field(default=0)
    last_deleted: PolyS | None = None
