from sqlalchemy import JSON, Float, String, Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography

from src.database.base import Base
from src.database.models.geo.region import Region
from src.database.models.geo.city import City


class EVStation(Base):
    __tablename__ = "ev_stations"

    id = Column(Integer, primary_key=True)
    cost = Column(String(255))
    location = Column(Geography("POINT"))
    address = Column(JSON)
    operator = Column(JSON)
    data_provider = Column(JSON)
    usage_type = Column(JSON)
    сonnections = Column(JSON)
    status_type = Column(JSON)
    submission_status_type = Column(JSON)
    number_points = Column(Integer)
    external_id = Column(JSON)
    use_time = Column(Float)

    region_id = Column(ForeignKey(Region.id))
    city_id = Column(ForeignKey(City.id))

    region = relationship(Region, backref="ev_stations")
    city = relationship(City, backref="ev_stations")
