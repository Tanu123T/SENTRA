import { apiClient } from './client';
import { SimulationCreate, SimulationRead, SimulationComparison } from '../types';

export const simulationsApi = {
  createSimulation: async (data: SimulationCreate): Promise<SimulationRead> => {
    const response = await apiClient.post<SimulationRead>('/simulations', data);
    return response.data;
  },

  getSimulationById: async (id: string): Promise<SimulationRead> => {
    const response = await apiClient.get<SimulationRead>(`/simulations/${id}`);
    return response.data;
  },

  compareSimulation: async (id: string): Promise<SimulationComparison> => {
    const response = await apiClient.get<SimulationComparison>(`/simulations/${id}/compare`);
    return response.data;
  },
};
