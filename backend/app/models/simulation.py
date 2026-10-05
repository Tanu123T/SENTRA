from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, String, Text, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Simulation(Base):
    __tablename__ = "simulations"
    __table_args__ = (
        CheckConstraint("scenario_type IN ('RAINFALL', 'RESOURCE', 'DEMAND')"),
        CheckConstraint("status IN ('CREATED', 'RUNNING', 'COMPLETED', 'FAILED')"),
        {"schema": "sentra"},
    )

    simulation_id: Mapped[int] = mapped_column(primary_key=True)
    simulation_name: Mapped[str] = mapped_column(String(150), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    scenario_type: Mapped[str] = mapped_column(String(50), nullable=False)
    parameters: Mapped[dict] = mapped_column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="CREATED")
    description: Mapped[str | None] = mapped_column(Text)
