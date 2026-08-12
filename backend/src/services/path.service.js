import pathRepository from '../repositories/path.repository.js';
import { parsePath } from '../utils/normalize.js';

class PathService {
  async findDeveloperToTechPath(username, technology) {
    if (!username || !technology) {
      throw { statusCode: 400, message: 'Both "from" (developer) and "to" (technology) are required' };
    }
    const path = await pathRepository.findDeveloperToTechPath(username, technology);
    if (!path) {
      return { found: false, path: [], relationships: [] };
    }
    return parsePath(path);
  }
}

export default new PathService();
