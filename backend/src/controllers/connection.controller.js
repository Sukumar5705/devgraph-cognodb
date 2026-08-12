import connectionService from '../services/connection.service.js';

class ConnectionController {
  async getConnectedDevelopers(req, res, next) {
    try {
      const { username } = req.params;
      const limit = parseInt(req.query.limit, 10) || 15;
      const data = await connectionService.getConnectedDevelopers(username, limit);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/connections?from=developerA&to=developerB
  async getDeveloperPath(req, res, next) {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Query parameters "from" and "to" are required' }
        });
      }
      const data = await connectionService.getDeveloperPath(from, to);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new ConnectionController();
