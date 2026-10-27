import { apiClient } from './client';
import { OptimizationRequest, OptimizationResponse, AllocationRead, PaginatedResponse } from '../types';

export const optimizationApi = {
  runOptimization: async (data: OptimizationRequest): Promise<OptimizationResponse> => {
    const response = await apiClient.post<OptimizationResponse>('/optimization/run', data);
    return response.data;
  },

  getRuns: async (params?: { district_id?: string; page?: number; page_size?: number }): Promise<PaginatedResponse<OptimizationResponse>> => {
    const response = await apiClient.get<PaginatedResponse<OptimizationResponse>>('/optimization/runs', { params });
    return response.data;
  },

  getRunById: async (id: string): Promise<OptimizationResponse> => {
    const response = await apiClient.get<OptimizationResponse>(`/optimization/runs/${id}`);
    return response.data;
  },

  getRunAllocations: async (runId: string): Promise<AllocationRead[]> => {
    const response = await apiClient.get<AllocationRead[]>(`/optimization/runs/${runId}/allocations`);
    return response.data;
  },

  confirmAllocation: async (allocationId: string): Promise<AllocationRead> => {
    const response = await apiClient.post<AllocationRead>(`/optimization/allocations/${allocationId}/confirm`);
    return response.data;
  },
};
