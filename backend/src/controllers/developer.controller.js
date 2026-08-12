import developerService from '../services/developer.service.js';

class DeveloperController {
  async getDeveloper(req, res, next) {
    try {
      const { username } = req.params;
      const data = await developerService.getDeveloper(username);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getNetwork(req, res, next) {
    try {
      const { username } = req.params;
      const data = await developerService.getNetwork(username);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeveloperController();
