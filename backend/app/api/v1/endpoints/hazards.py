"""Hazard metadata and model readiness endpoints."""

from typing import Annotated, Any, Dict, List
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.core.exceptions import EntityNotFoundException
from app.models.user import User
from app.prediction.registry import predictor_registry
from app.prediction.unavailable import HAZARD_SPECS
from app.schemas.risk_assessment import HazardModelStatus, HazardType

router = APIRouter(prefix="/hazards", tags=["Hazards & Models"])


@router.get("", response_model=List[Dict[str, Any]])
def list_supported_hazards(
    _: Annotated[User, Depends(get_current_user)],
) -> List[Dict[str, Any]]:
    """List the seven disaster hazards supported by SENTRA with domain metadata."""
    results = []
    for hazard_type, (name, description, features) in HAZARD_SPECS.items():
        results.append(
            {
                "hazard_type": hazard_type.value,
                "name": name,
                "description": description,
                "expected_features": features,
            }
        )
    return results


@router.get("/models/status", response_model=List[HazardModelStatus])
def get_model_readiness_status(
    _: Annotated[User, Depends(get_current_user)],
) -> List[HazardModelStatus]:
    """Report the deployment and readiness status of each of the seven hazard models."""
    return predictor_registry.get_all_statuses()


@router.get("/{hazard_type}", response_model=Dict[str, Any])
def get_hazard_details(
    hazard_type: str,
    _: Annotated[User, Depends(get_current_user)],
) -> Dict[str, Any]:
    """Get metadata for a specific hazard category."""
    try:
        ht = HazardType(hazard_type.upper())
    except ValueError:
        raise EntityNotFoundException("HazardType", hazard_type)

    name, description, features = HAZARD_SPECS[ht]
    return {
        "hazard_type": ht.value,
        "name": name,
        "description": description,
        "expected_features": features,
    }
