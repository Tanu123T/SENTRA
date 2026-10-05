from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.ward import Ward


class PopulationExposure(Base):
    __tablename__ = "population_exposure"
    __table_args__ = (
        CheckConstraint("population_exposed >= 0"),
        CheckConstraint("exposure_percent IS NULL OR exposure_percent BETWEEN 0 AND 100"),
        {"schema": "sentra"},
    )

    exposure_id: Mapped[int] = mapped_column(primary_key=True)
    ward_id: Mapped[int] = mapped_column(ForeignKey("sentra.wards.ward_id"), nullable=False)
    assessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    population_exposed: Mapped[int] = mapped_column(Integer, nullable=False)
    exposure_percent: Mapped[float | None] = mapped_column(Numeric(5, 2))
    severity: Mapped[str | None] = mapped_column(String(20))

    ward: Mapped["Ward"] = relationship(back_populates="population_exposures")
