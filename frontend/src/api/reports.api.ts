import { apiClient } from './client';
import { SystemSummaryReport, DisasterImpactReport } from '../types';

export const reportsApi = {
  getSystemSummary: async (): Promise<SystemSummaryReport> => {
    const response = await apiClient.get<SystemSummaryReport>('/reports/summary');
    return response.data;
  },

  getDisasterImpactReport: async (stateId?: string): Promise<DisasterImpactReport> => {
    const params = stateId ? { state_id: stateId } : {};
    const response = await apiClient.get<DisasterImpactReport>('/reports/disaster-impact', { params });
    return response.data;
  },
};
