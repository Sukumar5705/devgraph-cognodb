import { apiClient } from './client';
import type { ApiEnvelope, Technology, TechnologyCommunity } from '../types/graph';

export const getTechnology = async (name: string): Promise<Technology> => {
  const { data } = await apiClient.get<ApiEnvelope<Technology>>(`/technologies/${name}`);
  return data.data;
};

export const getTechnologyCommunity = async (name: string, limit = 20): Promise<TechnologyCommunity> => {
  const { data } = await apiClient.get<ApiEnvelope<TechnologyCommunity>>(
    `/technologies/${name}/community`,
    { params: { limit } }
  );
  return data.data;
};
