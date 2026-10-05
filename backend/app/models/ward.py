from typing import TYPE_CHECKING

from geoalchemy2 import Geometry
from sqlalchemy import CheckConstraint, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.population_exposure import PopulationExposure
    from app.models.resource_allocation import ResourceAllocation
    from app.models.risk_assessment import RiskAssessment
    from app.models.weather_observation import WeatherObservation


class Ward(Base):
    __tablename__ = "wards"
    __table_args__ = (
        CheckConstraint("population IS NULL OR population >= 0"),
        CheckConstraint("area_sq_km IS NULL OR area_sq_km >= 0"),
        {"schema": "sentra"},
    )

    ward_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ward_name: Mapped[str] = mapped_column(String(100), nullable=False)
    population: Mapped[int | None] = mapped_column(Integer)
    area_sq_km: Mapped[float | None] = mapped_column(Numeric(10, 2))
    geometry: Mapped[object | None] = mapped_column(Geometry("MULTIPOLYGON", srid=4326))

    weather_observations: Mapped[list["WeatherObservation"]] = relationship(back_populates="ward")
    risk_assessments: Mapped[list["RiskAssessment"]] = relationship(back_populates="ward")
    population_exposures: Mapped[list["PopulationExposure"]] = relationship(back_populates="ward")
    resource_allocations: Mapped[list["ResourceAllocation"]] = relationship(back_populates="ward")
