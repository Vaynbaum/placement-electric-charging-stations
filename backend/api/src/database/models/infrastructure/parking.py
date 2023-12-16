from sqlalchemy import String, Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography

from src.database.base import Base
from src.database.models.geo.city import City


class Parking(Base):
    __tablename__ = "parkings"

    id = Column(Integer, primary_key=True)
    location = Column(Geography("POINT"))
    address = Column(String)
    description = Column(String)
    city_id = Column(ForeignKey(City.id))

    city = relationship(City, backref="parkings")
