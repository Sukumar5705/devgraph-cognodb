import developerRepository from '../repositories/developer.repository.js';
import ingestionService from './ingestion.service.js';
import { parseNetwork } from '../utils/normalize.js';

class DeveloperService {
  async getDeveloper(username) {
    if (!username) {
      throw { statusCode: 400, message: 'Username is required' };
    }

    let data = await developerRepository.getDeveloperProfile(username);

    if (!data) {
      await ingestionService.ingestDeveloper(username);
      data = await developerRepository.getDeveloperProfile(username);
    }

    if (!data) {
      throw { statusCode: 404, message: 'Developer not found' };
    }

    return data;
  }

  async getNetwork(username) {
    if (!username) {
      throw { statusCode: 400, message: 'Username is required' };
    }

    const exists = await developerRepository.developerExists(username);
    if (!exists) {
      await ingestionService.ingestDeveloper(username);
    }

    const records = await developerRepository.getDeveloperNetwork(username);
    return parseNetwork(records);
  }
}

export default new DeveloperService();
