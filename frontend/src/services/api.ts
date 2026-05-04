import { Zone, Dataset, Coverage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  getZones: async (): Promise<Zone[]> => {
    const res = await fetch(`${API_BASE_URL}/zones`);
    if (!res.ok) throw new Error('Failed to fetch zones');
    return res.json();
  },

  getDatasets: async (): Promise<Dataset[]> => {
    const res = await fetch(`${API_BASE_URL}/datasets`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    return res.json();
  },

  getCoverage: async (params: { zone_id?: number; dataset_id?: number }): Promise<Coverage[]> => {
    const query = new URLSearchParams();
    if (params.zone_id) query.append('zone_id', params.zone_id.toString());
    if (params.dataset_id) query.append('dataset_id', params.dataset_id.toString());
    
    const res = await fetch(`${API_BASE_URL}/coverage?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch coverage');
    return res.json();
  }
};
