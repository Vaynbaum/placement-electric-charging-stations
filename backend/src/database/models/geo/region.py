from sqlalchemy import Float, String, Integer, Text, Column
from geoalchemy2 import Geography


from src.database.base import Base


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
