from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from src.database.models import *


class RegionSchema(sqlalchemy_to_pydantic(Region, exclude=["location", "geometry"])):
    center: dict | None = None
    border: dict | None = None
    growth_car_id: int
    cost_ee: float

    class Config:
        from_attributes = True


class CityDBSchema(sqlalchemy_to_pydantic(City, exclude=["location", "geometry"])):
    is_top: bool | None = False
    region_id: int | None = None
    center: dict | None = None
    border: dict | None = None
    growth_car_id: int | None = None
    cost_ee: float | None = None

    class Config:
        from_attributes = True


class CitySchema(CityDBSchema):
    region: RegionSchema | None = None

    class Config:
        from_attributes = True
