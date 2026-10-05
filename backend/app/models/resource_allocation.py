from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.resource import Resource
    from app.models.ward import Ward


class ResourceAllocation(Base):
    __tablename__ = "resource_allocations"
    __table_args__ = (
        CheckConstraint("quantity > 0"),
        CheckConstraint("priority_score IS NULL OR priority_score BETWEEN 0 AND 100"),
        CheckConstraint("status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')"),
        {"schema": "sentra"},
    )

    allocation_id: Mapped[int] = mapped_column(primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("sentra.resources.resource_id"), nullable=False)
    ward_id: Mapped[int] = mapped_column(ForeignKey("sentra.wards.ward_id"), nullable=False)
    allocated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    priority_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="PLANNED")

    resource: Mapped["Resource"] = relationship(back_populates="allocations")
    ward: Mapped["Ward"] = relationship(back_populates="resource_allocations")
