from sqlalchemy import Integer, Column

from src.database.base import Base


class EVLoad(Base):
    __tablename__ = "ev_loads"

    id = Column(Integer, primary_key=True)
    min_pop = Column(Integer)
    max_pop = Column(Integer)
    value = Column(Integer)
