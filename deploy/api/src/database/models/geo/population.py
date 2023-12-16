from sqlalchemy import Float, ForeignKey, Integer, Column
from geoalchemy2 import Geography
from sqlalchemy.orm import relationship


from src.database.base import Base
from src.database.models.geo.city import City


class Population(Base):
    __tablename__ = "populations"

    id = Column(Integer, primary_key=True)
    location = Column(Geography("POINT"))
    geometry = Column(Geography("POLYGON"))
    value = Column(Float)
    city_id = Column(ForeignKey(City.id))

    city = relationship(City, backref="populations")
