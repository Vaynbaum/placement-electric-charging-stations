from sqlalchemy import Boolean, Float, String, Integer, Text, Column, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography

from src.database.models.geo.region import Region
from src.database.base import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    region_id = Column(ForeignKey(Region.id))
    location = Column(Geography("POINT"))
    geometry = Column(Geography("POLYGON"))
    type = Column(String(255))
    north = Column(Float)
    south = Column(Float)
    east = Column(Float)
    west = Column(Float)
    is_top = Column(Boolean, default=False)
    display_name = Column(Text)
    importance = Column(Float)

    region = relationship(Region, backref="cities")
