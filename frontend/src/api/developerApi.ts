import { apiClient } from './client';
import type { ApiEnvelope, DeveloperProfile, DeveloperConnection, GraphData } from '../types/graph';

export const getDeveloper = async (username: string): Promise<DeveloperProfile> => {
  const { data } = await apiClient.get<ApiEnvelope<DeveloperProfile>>(`/developers/${username}`);
  return data.data;
};

export const getDeveloperNetwork = async (username: string): Promise<GraphData> => {
  const { data } = await apiClient.get<ApiEnvelope<GraphData>>(`/developers/${username}/network`);
  return data.data;
};

export const getDeveloperConnections = async (username: string, limit = 10): Promise<DeveloperConnection[]> => {
  const { data } = await apiClient.get<ApiEnvelope<DeveloperConnection[]>>(
    `/developers/${username}/connections`,
    { params: { limit } }
  );
  return data.data;
};
