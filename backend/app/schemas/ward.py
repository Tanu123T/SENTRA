from pydantic import BaseModel, ConfigDict, Field


class WardBase(BaseModel):
    ward_name: str = Field(..., min_length=1, max_length=100)
    population: int | None = Field(default=None, ge=0)
    area_sq_km: float | None = Field(default=None, ge=0)


class WardCreate(WardBase):
    geometry: dict | None = None


class WardUpdate(BaseModel):
    ward_name: str | None = Field(default=None, min_length=1, max_length=100)
    population: int | None = Field(default=None, ge=0)
    area_sq_km: float | None = Field(default=None, ge=0)
    geometry: dict | None = None


class WardResponse(WardBase):
    ward_id: int
    geometry: dict | None = None

    model_config = ConfigDict(from_attributes=True)