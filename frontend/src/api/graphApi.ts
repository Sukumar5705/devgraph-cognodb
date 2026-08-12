import { apiClient } from './client';
import type { ApiEnvelope, GraphData } from '../types/graph';

/**
 * Expand a specific graph node by type and ID.
 * Returns new nodes/edges to merge into the existing graph.
 *
 * nodeType: Developer | Repository | Technology | Topic | Organization
 * nodeId: the identifying value (username, normalizedName, fullName, login)
 */
export const expandNode = async (
  nodeType: string,
  nodeId: string,
  depth = 1
): Promise<GraphData> => {
  const { data } = await apiClient.get<ApiEnvelope<GraphData>>('/graph/expand', {
    params: { nodeType, nodeId, depth },
  });
  return data.data;
};
