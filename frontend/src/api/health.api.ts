import { apiClient } from './client';
import { HealthImpactRead, HealthImpactEstimateRequest, PaginatedResponse } from '../types';

export const healthApi = {
  estimateImpact: async (data: HealthImpactEstimateRequest): Promise<HealthImpactRead> => {
    const response = await apiClient.post<HealthImpactRead>('/health-impacts/estimate', data);
    return response.data;
  },

  getImpacts: async (params?: { district_id?: string; page?: number; page_size?: number }): Promise<PaginatedResponse<HealthImpactRead>> => {
    const response = await apiClient.get<PaginatedResponse<HealthImpactRead>>('/health-impacts', { params });
    return response.data;
  },

  getImpactById: async (id: string): Promise<HealthImpactRead> => {
    const response = await apiClient.get<HealthImpactRead>(`/health-impacts/${id}`);
    return response.data;
  },
};
