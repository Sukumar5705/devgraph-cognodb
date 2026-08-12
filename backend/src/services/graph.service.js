import graphRepository from '../repositories/graph.repository.js';
import { parseNetwork } from '../utils/normalize.js';

class GraphService {
  /**
   * Expand a graph node by type and ID.
   * Returns { nodes, edges } — safe to merge into existing frontend graph.
   */
  async expandNode(nodeType, nodeId, depth = 1) {
    if (!graphRepository.isValidNodeType(nodeType)) {
      const error = new Error(`Invalid node type: "${nodeType}"`);
      error.statusCode = 400;
      throw error;
    }
    if (!nodeId) {
      const error = new Error('nodeId is required');
      error.statusCode = 400;
      throw error;
    }

    const limit = Math.min(20, Math.max(5, parseInt(depth, 10) * 10));
    let records;

    switch (nodeType) {
      case 'Developer':
        records = await graphRepository.expandDeveloper(nodeId, limit);
        break;
      case 'Technology':
        records = await graphRepository.expandTechnology(nodeId, limit);
        break;
      case 'Repository':
        records = await graphRepository.expandRepository(nodeId, limit);
        break;
      case 'Topic':
        records = await graphRepository.expandTopic(nodeId, limit);
        break;
      case 'Organization':
        records = await graphRepository.expandOrganization(nodeId, limit);
        break;
      default:
        records = [];
    }

    return parseNetwork(records);
  }
}

export default new GraphService();
