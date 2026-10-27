import { apiClient } from './client';
import { ResourceRead, ResourceUpdate, PaginatedResponse } from '../types';

export const resourcesApi = {
  getResources: async (params?: {
    district_id?: string;
    resource_type?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ResourceRead>> => {
    const response = await apiClient.get<PaginatedResponse<ResourceRead>>('/resources', { params });
    return response.data;
  },

  getResourceById: async (id: string): Promise<ResourceRead> => {
    const response = await apiClient.get<ResourceRead>(`/resources/${id}`);
    return response.data;
  },

  updateResource: async (id: string, data: ResourceUpdate): Promise<ResourceRead> => {
    const response = await apiClient.patch<ResourceRead>(`/resources/${id}`, data);
    return response.data;
  },

  getDistrictResources: async (districtId: string): Promise<PaginatedResponse<ResourceRead>> => {
    const response = await apiClient.get<PaginatedResponse<ResourceRead>>(`/locations/districts/${districtId}/resources`);
    return response.data;
  },
};
