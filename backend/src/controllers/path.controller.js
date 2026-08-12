import pathService from '../services/path.service.js';

class PathController {
  async getPath(req, res, next) {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Query parameters "from" and "to" are required' }
        });
      }
      const data = await pathService.findDeveloperToTechPath(from, to);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new PathController();
