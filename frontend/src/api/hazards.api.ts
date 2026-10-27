import { apiClient } from './client';
import { HazardModelStatus, RiskAssessmentRead, RiskAssessmentCreate, PaginatedResponse } from '../types';

export const hazardsApi = {
  getSupportedHazards: async (): Promise<Array<{ hazard_type: string; name: string; description: string; expected_features: string[] }>> => {
    const response = await apiClient.get('/hazards');
    return response.data;
  },

  getModelStatuses: async (): Promise<HazardModelStatus[]> => {
    const response = await apiClient.get<HazardModelStatus[]>('/hazards/models/status');
    return response.data;
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
