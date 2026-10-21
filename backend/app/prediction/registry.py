"""Central registry for hazard prediction model adapters."""

from typing import Dict, List, Optional
from app.prediction.base import BasePredictor
from app.prediction.unavailable import HAZARD_SPECS, UnavailableHazardPredictor
from app.schemas.risk_assessment import HazardModelStatus, HazardType


class PredictorRegistry:
    """Registry maintaining active adapters for all 7 hazard types."""

    def __init__(self):
        self._predictors: Dict[HazardType, BasePredictor] = {}
        self._initialize_default_adapters()

    def _initialize_default_adapters(self) -> None:
        """Register default explicit unavailable predictors for all seven hazards."""
        for hazard_type, (name, description, inputs) in HAZARD_SPECS.items():
            self._predictors[hazard_type] = UnavailableHazardPredictor(
                hazard=hazard_type,
                model_name=name,
                description=description,
                expected_inputs=inputs,
            )

    def register(self, hazard_type: HazardType, predictor: BasePredictor) -> None:
        """Register a concrete predictor adapter (e.g. when a trained ML model is introduced)."""
        self._predictors[hazard_type] = predictor

    def get(self, hazard_type: HazardType) -> Optional[BasePredictor]:
        """Retrieve the configured predictor for a hazard type."""
        return self._predictors.get(hazard_type)

    def get_all_statuses(self) -> List[HazardModelStatus]:
        """Return readiness and capability status for all seven hazard models."""
        statuses = []
        for hazard_type, predictor in self._predictors.items():
            statuses.append(
                HazardModelStatus(
                    hazard_type=hazard_type,
                    model_name=predictor.model_name,
                    model_version=predictor.model_version,
                    is_available=predictor.is_available,
                    readiness_status=predictor.readiness_status,
                    description=predictor.description,
                    expected_inputs=predictor.expected_inputs,
                )
            )
        return statuses


# System-wide singleton registry instance
predictor_registry = PredictorRegistry()
