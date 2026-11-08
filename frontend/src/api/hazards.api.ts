import { apiClient } from './client';
import { HazardModelStatus, RiskAssessmentRead, RiskAssessmentCreate, PaginatedResponse } from '../types';
import { SEED_MODEL_STATUSES } from '../utils/mockSeedData';

export const hazardsApi = {
  getSupportedHazards: async (): Promise<Array<{ hazard_type: string; name: string; description: string; expected_features: string[] }>> => {
    try {
      const response = await apiClient.get('/hazards');
      return response.data;
    } catch {
      return [
        { hazard_type: 'FLOOD', name: 'Flood & Inundation', description: 'Real-time inundation modeling', expected_features: ['precipitation', 'river_discharge'] },
        { hazard_type: 'CYCLONE', name: 'Tropical Cyclone', description: 'Track & surge predictions', expected_features: ['wind_speed', 'central_pressure'] },
        { hazard_type: 'HEATWAVE', name: 'Heatwave Stress', description: 'Thermal mortality & wet-bulb index', expected_features: ['temperature', 'relative_humidity'] },
        { hazard_type: 'EARTHQUAKE', name: 'Seismic Hazards', description: 'Peak ground acceleration & shaking', expected_features: ['depth', 'magnitude'] },
      ];
    }
  },

  getModelStatuses: async (): Promise<HazardModelStatus[]> => {
    try {
      const response = await apiClient.get<HazardModelStatus[]>('/hazards/models/status');
      return response.data;
    } catch (err) {
      return SEED_MODEL_STATUSES;
    }
  },

  getHazardDetails: async (hazardType: string): Promise<any> => {
    const response = await apiClient.get(`/hazards/${hazardType}`);
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
};
