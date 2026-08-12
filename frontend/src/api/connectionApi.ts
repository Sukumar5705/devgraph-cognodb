import { apiClient } from './client';
import type { ApiEnvelope, ConnectionPath } from '../types/graph';

/** Find the shortest graph path between two developers. */
export const getDeveloperPath = async (from: string, to: string): Promise<ConnectionPath> => {
  const { data } = await apiClient.get<ApiEnvelope<ConnectionPath>>('/connections', {
    params: { from, to },
  });
  return data.data;
};
