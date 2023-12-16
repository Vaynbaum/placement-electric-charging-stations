from sqlalchemy import Float, ForeignKey, String, Integer, Text, Column
from geoalchemy2 import Geography
from sqlalchemy.orm import relationship


from src.database.base import Base
from src.database.models.geo.growth_car import GrowthCar


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    location = Column(Geography("POINT"))
    geometry = Column(Geography("POLYGON"))
    type = Column(String(255))
    north = Column(Float)
    south = Column(Float)
    east = Column(Float)
    west = Column(Float)
    display_name = Column(Text)
    importance = Column(Float)
    growth_car_id = Column(ForeignKey(GrowthCar.id))
    cost_ee = Column(Float)

    growth_car = relationship(GrowthCar, backref="regions")
