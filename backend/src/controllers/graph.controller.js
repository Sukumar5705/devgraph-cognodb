import graphService from '../services/graph.service.js';

class GraphController {
  async expandNode(req, res, next) {
    try {
      const { nodeType, nodeId, depth = 1 } = req.query;
      if (!nodeType || !nodeId) {
        return res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Query parameters "nodeType" and "nodeId" are required' }
        });
      }
      const data = await graphService.expandNode(nodeType, nodeId, depth);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new GraphController();
