from sqlalchemy import Float, Integer, Column

from src.database.base import Base


class GrowthCar(Base):
    __tablename__ = "growth_cars"

    id = Column(Integer, primary_key=True)
    value = Column(Float)
