from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.ward import Ward


class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    __table_args__ = (
        CheckConstraint("rainfall_mm IS NULL OR rainfall_mm >= 0"),
        CheckConstraint("humidity_percent IS NULL OR humidity_percent BETWEEN 0 AND 100"),
        {"schema": "sentra"},
    )

    observation_id: Mapped[int] = mapped_column(primary_key=True)
    ward_id: Mapped[int] = mapped_column(ForeignKey("sentra.wards.ward_id"), nullable=False)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    rainfall_mm: Mapped[float | None] = mapped_column(Numeric(10, 2))
    temperature_c: Mapped[float | None] = mapped_column(Numeric(6, 2))
    humidity_percent: Mapped[float | None] = mapped_column(Numeric(5, 2))

    ward: Mapped["Ward"] = relationship(back_populates="weather_observations")
