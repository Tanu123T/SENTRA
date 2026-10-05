from fastapi import FastAPI

from app.routers.wards import router as wards_router


app = FastAPI(
    title="SENTRA API",
    description="Climate-Health Early Warning & Resource Simulation Platform",
    version="1.0.0",
)


app.include_router(wards_router)


@app.get("/")
async def root():
    return {
        "message": "SENTRA API is running",
        "status": "success",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
    }