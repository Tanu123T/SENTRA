from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.ward import WardCreate, WardResponse, WardUpdate
from app.services import ward_services as ward_service


router = APIRouter(
    prefix="/api/v1/wards",
    tags=["Wards"],
)


@router.get("/", response_model=list[WardResponse])
async def get_wards(
    db: AsyncSession = Depends(get_db),
):
    return await ward_service.get_all_wards(db)


@router.get("/{ward_id}", response_model=WardResponse)
async def get_ward(
    ward_id: int,
    db: AsyncSession = Depends(get_db),
):
    ward = await ward_service.get_ward_by_id(db, ward_id)

    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ward not found",
        )

    return ward


@router.post(
    "/",
    response_model=WardResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_ward(
    ward_data: WardCreate,
    db: AsyncSession = Depends(get_db),
):
    return await ward_service.create_ward(
        db=db,
        ward_name=ward_data.ward_name,
        population=ward_data.population,
        area_sq_km=ward_data.area_sq_km,
        geometry=ward_data.geometry,
    )


@router.put("/{ward_id}", response_model=WardResponse)
async def update_ward(
    ward_id: int,
    ward_data: WardUpdate,
    db: AsyncSession = Depends(get_db),
):
    ward = await ward_service.get_ward_by_id(db, ward_id)

    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ward not found",
        )

    return await ward_service.update_ward(
        db=db,
        ward=ward,
        ward_name=ward_data.ward_name,
        population=ward_data.population,
        area_sq_km=ward_data.area_sq_km,
        geometry=ward_data.geometry,
    )


@router.delete(
    "/{ward_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_ward(
    ward_id: int,
    db: AsyncSession = Depends(get_db),
):
    ward = await ward_service.get_ward_by_id(db, ward_id)

    if ward is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ward not found",
        )

    await ward_service.delete_ward(db, ward)