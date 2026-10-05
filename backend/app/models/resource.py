from typing import TYPE_CHECKING

from geoalchemy2 import Geometry
from sqlalchemy import CheckConstraint, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.resource_allocation import ResourceAllocation


class Resource(Base):
    __tablename__ = "resources"
    __table_args__ = (
        CheckConstraint("resource_type IN ('AMBULANCE', 'BED', 'SHELTER')"),
        CheckConstraint("capacity >= 0"),
        CheckConstraint("available_units >= 0"),
        CheckConstraint("available_units <= capacity"),
        CheckConstraint("status IN ('AVAILABLE', 'BUSY', 'OFFLINE')"),
        {"schema": "sentra"},
    )

    resource_id: Mapped[int] = mapped_column(primary_key=True)
    resource_type: Mapped[str] = mapped_column(String(30), nullable=False)
    resource_name: Mapped[str] = mapped_column(String(150), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    available_units: Mapped[int] = mapped_column(Integer, nullable=False)
    location: Mapped[object | None] = mapped_column(Geometry("POINT", srid=4326))
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="AVAILABLE")

    allocations: Mapped[list["ResourceAllocation"]] = relationship(back_populates="resource")
