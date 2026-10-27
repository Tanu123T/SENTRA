import { apiClient } from './client';
import { AlertRead, AlertCreate, AlertUpdate, PaginatedResponse } from '../types';

export const alertsApi = {
  getAlerts: async (params?: {
    district_id?: string;
    hazard_type?: string;
    severity?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<AlertRead>> => {
    const response = await apiClient.get<PaginatedResponse<AlertRead>>('/alerts', { params });
    return response.data;
  },

  getAlertById: async (id: string): Promise<AlertRead> => {
    const response = await apiClient.get<AlertRead>(`/alerts/${id}`);
    return response.data;
  },

  createAlert: async (data: AlertCreate): Promise<AlertRead> => {
    const response = await apiClient.post<AlertRead>('/alerts', data);
    return response.data;
  },

  updateAlert: async (id: string, data: AlertUpdate): Promise<AlertRead> => {
    const response = await apiClient.patch<AlertRead>(`/alerts/${id}`, data);
    return response.data;
  },
};
