import { apiClient } from './client';
import {
  HazardModelStatus,
  HazardReadinessInfo,
  HistoricalEvent,
  HazardPredictionOutput,
  GeospatialImpactEnvelope,
  RiskAssessmentRead,
  RiskAssessmentCreate,
  PaginatedResponse,
} from '../types';
import {
  SEED_MODEL_STATUSES,
  SEED_DETAILED_READINESS,
  SEED_HISTORICAL_EVENTS,
} from '../utils/mockSeedData';

export const hazardsApi = {
  getSupportedHazards: async (): Promise<Array<{
    hazard_type: string;
    name: string;
    version?: string;
    description: string;
    expected_features: string[];
    is_available?: boolean;
    readiness_status?: string;
    wave_propagation?: string | null;
    coastal_inundation?: string | null;
    blocker_reason?: string | null;
  }>> => {
    try {
      const response = await apiClient.get('/hazards');
      return response.data;
    } catch {
      return SEED_DETAILED_READINESS.map((r) => ({
        hazard_type: r.hazard_type,
        name: r.model_name,
        version: r.model_version,
        description: r.scientific_methodology,
        expected_features: r.expected_inputs,
        is_available: r.is_available,
        readiness_status: r.readiness_status,
        wave_propagation: r.wave_propagation,
        coastal_inundation: r.coastal_inundation,
        blocker_reason: r.blocker_reason,
      }));
    }
  },

  getModelStatuses: async (): Promise<HazardModelStatus[]> => {
    try {
      const response = await apiClient.get<HazardModelStatus[]>('/hazards/models/status');
      return response.data;
    } catch {
      return SEED_MODEL_STATUSES;
    }
  },

  getDetailedReadiness: async (): Promise<HazardReadinessInfo[]> => {
    try {
      const response = await apiClient.get<HazardReadinessInfo[]>('/hazards/readiness/detailed');
      return response.data;
    } catch {
      return SEED_DETAILED_READINESS;
    }
  },

  getHistoricalEvents: async (params?: {
    hazard_type?: string;
    state_code?: string;
    min_year?: number;
  }): Promise<HistoricalEvent[]> => {
    try {
      const response = await apiClient.get<HistoricalEvent[]>('/hazards/historical/events', { params });
      return response.data;
    } catch {
      let events = SEED_HISTORICAL_EVENTS;
      if (params?.hazard_type) {
        events = events.filter((e) => e.hazard_type === params.hazard_type);
      }
      if (params?.state_code) {
        events = events.filter((e) => e.state_code.toUpperCase() === params.state_code?.toUpperCase());
      }
      return events;
    }
  },

  getHazardDetails: async (hazardType: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/hazards/${hazardType}`);
      return response.data;
    } catch {
      const match = SEED_DETAILED_READINESS.find((r) => r.hazard_type === hazardType);
      return match || {
        hazard_type: hazardType,
        name: `SENTRA-${hazardType}`,
        is_available: false,
        readiness_status: 'PLANNED_RESEARCH',
      };
    }
  },

  getGeospatialEnvelope: async (
    hazardType: string,
    params: { latitude: number; longitude: number; severity?: string; primary_metric?: number }
  ): Promise<GeospatialImpactEnvelope> => {
    const response = await apiClient.get<GeospatialImpactEnvelope>(`/hazards/${hazardType}/envelope`, { params });
    return response.data;
  },

  simulateHazard: async (
    hazardType: string,
    payload: Record<string, any>
  ): Promise<HazardPredictionOutput> => {
    const response = await apiClient.post<HazardPredictionOutput>(`/hazards/${hazardType}/simulate`, payload);
    return response.data;
  },

  requestRiskAssessment: async (data: RiskAssessmentCreate): Promise<RiskAssessmentRead> => {
    const response = await apiClient.post<RiskAssessmentRead>('/risk-assessments', data);
    return response.data;
  },

  getRiskAssessments: async (params?: {
    district_id?: string;
    hazard_type?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<RiskAssessmentRead>> => {
    const response = await apiClient.get<PaginatedResponse<RiskAssessmentRead>>('/risk-assessments', { params });
    return response.data;
  },

  getRiskAssessmentById: async (id: string): Promise<RiskAssessmentRead> => {
    const response = await apiClient.get<RiskAssessmentRead>(`/risk-assessments/${id}`);
    return response.data;
  },

  getDistrictBaseline: async (districtName: string): Promise<{
    district_name: string;
    found: boolean;
    metrics?: {
      district_name: string;
      human_fatality_historical: number;
      human_injured_historical: number;
      population: number;
      mean_flood_duration_days: number;
    };
  }> => {
    try {
      const response = await apiClient.get(`/hazards/districts/${encodeURIComponent(districtName)}/baseline`);
      return response.data;
    } catch {
      return { district_name: districtName, found: false };
    }
  },
};
