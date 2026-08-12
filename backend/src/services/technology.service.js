import technologyRepository from '../repositories/technology.repository.js';

class TechnologyService {
  async getTechnology(name) {
    if (!name) {
      throw { statusCode: 400, message: 'Technology name is required' };
    }
    const data = await technologyRepository.getTechnology(name);
    if (!data) {
      throw { statusCode: 404, message: `Technology "${name}" not found` };
    }
    return data;
  }

  async getTechnologyCommunity(name, limit) {
    if (!name) {
      throw { statusCode: 400, message: 'Technology name is required' };
    }
    const data = await technologyRepository.getTechnologyCommunity(name, limit);
    if (!data) {
      throw { statusCode: 404, message: `Technology "${name}" not found` };
    }
    return data;
  }
}

export default new TechnologyService();
