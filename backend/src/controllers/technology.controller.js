import technologyService from '../services/technology.service.js';

class TechnologyController {
  async getTechnology(req, res, next) {
    try {
      const { name } = req.params;
      const data = await technologyService.getTechnology(name);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getCommunity(req, res, next) {
    try {
      const { name } = req.params;
      const limit = parseInt(req.query.limit, 10) || 20;
      const data = await technologyService.getTechnologyCommunity(name, limit);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new TechnologyController();
