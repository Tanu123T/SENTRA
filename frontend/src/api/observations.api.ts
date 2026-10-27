import { apiClient } from './client';
import { ObservationRead, ObservationCreate, PaginatedResponse } from '../types';

export const observationsApi = {
  getObservations: async (params?: {
    district_id?: string;
    observation_type?: string;
    start_time?: string;
    end_time?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ObservationRead>> => {
    const response = await apiClient.get<PaginatedResponse<ObservationRead>>('/observations', { params });
    return response.data;
  },

  getObservationById: async (id: string): Promise<ObservationRead> => {
    const response = await apiClient.get<ObservationRead>(`/observations/${id}`);
    return response.data;
  },

  createObservation: async (data: ObservationCreate): Promise<ObservationRead> => {
    const response = await apiClient.post<ObservationRead>('/observations', data);
    return response.data;
  },

  bulkCreateObservations: async (observations: ObservationCreate[]): Promise<ObservationRead[]> => {
    const response = await apiClient.post<ObservationRead[]>('/observations/bulk', { observations });
    return response.data;
  },
};
