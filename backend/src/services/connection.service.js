import connectionRepository from '../repositories/connection.repository.js';
import { parsePath } from '../utils/normalize.js';

class ConnectionService {
  /**
   * Get developers connected to `username` via shared technologies, topics, orgs.
   * Returns list with reasons for each connection.
   */
  async getConnectedDevelopers(username, limit = 15) {
    const developers = await connectionRepository.getConnectedDevelopers(username, limit);

    return developers.map(dev => {
      const reasons = [];
      const techs = Array.isArray(dev.sharedTechnologies) ? dev.sharedTechnologies : [];
      const topics = Array.isArray(dev.sharedTopics) ? dev.sharedTopics : [];
      const orgs = Array.isArray(dev.sharedOrganizations) ? dev.sharedOrganizations : [];

      if (techs.length > 0) {
        reasons.push(`Shares ${techs.length} technolog${techs.length === 1 ? 'y' : 'ies'}`);
      }
      if (topics.length > 0) {
        reasons.push(`Shares ${topics.length} topic${topics.length === 1 ? '' : 's'}`);
      }
      if (orgs.length > 0) {
        reasons.push(`Member of ${orgs.length} shared organization${orgs.length === 1 ? '' : 's'}`);
      }

      return {
        username: dev.username,
        name: dev.name,
        avatarUrl: dev.avatarUrl,
        sharedTechnologies: techs,
        sharedTopics: topics,
        sharedOrganizations: orgs,
        totalConnections: dev.totalConnections,
        reasons
      };
    });
  }

  /**
   * Find shortest path between two developers via graph traversal.
   * Returns parsed path with nodes and relationships for UI rendering.
   */
  async getDeveloperPath(fromUsername, toUsername) {
    if (!fromUsername || !toUsername) {
      const error = new Error('Both "from" and "to" developer usernames are required');
      error.statusCode = 400;
      throw error;
    }

    if (fromUsername.toLowerCase() === toUsername.toLowerCase()) {
      return { found: false, path: [], relationships: [], message: 'Source and target are the same developer' };
    }

    const rawPath = await connectionRepository.getDeveloperToDevPath(fromUsername, toUsername);
    if (!rawPath) {
      return { found: false, path: [], relationships: [], message: 'No connection found within the explored graph depth' };
    }

    return parsePath(rawPath);
  }
}

export default new ConnectionService();
