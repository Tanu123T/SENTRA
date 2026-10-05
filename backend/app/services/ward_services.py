from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ward import Ward


async def get_all_wards(db: AsyncSession) -> list[Ward]:
    result = await db.execute(
        select(Ward).order_by(Ward.ward_id)
    )
    return list(result.scalars().all())


async def get_ward_by_id(
    db: AsyncSession,
    ward_id: int,
) -> Ward | None:
    result = await db.execute(
        select(Ward).where(Ward.ward_id == ward_id)
    )
    return result.scalar_one_or_none()


async def create_ward(
    db: AsyncSession,
    ward_name: str,
    population: int | None,
    area_sq_km: float | None,
    geometry,
) -> Ward:
    ward = Ward(
        ward_name=ward_name,
        population=population,
        area_sq_km=area_sq_km,
        geometry=geometry,
    )

    db.add(ward)
    await db.commit()
    await db.refresh(ward)

    return ward


async def update_ward(
    db: AsyncSession,
    ward: Ward,
    ward_name: str | None = None,
    population: int | None = None,
    area_sq_km: float | None = None,
    geometry=None,
) -> Ward:

    if ward_name is not None:
        ward.ward_name = ward_name

    if population is not None:
        ward.population = population

    if area_sq_km is not None:
        ward.area_sq_km = area_sq_km

    if geometry is not None:
        ward.geometry = geometry

    await db.commit()
    await db.refresh(ward)

    return ward


async def delete_ward(
    db: AsyncSession,
    ward: Ward,
) -> None:
    await db.delete(ward)
    await db.commit()