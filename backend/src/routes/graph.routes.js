import { Router } from 'express';
import graphController from '../controllers/graph.controller.js';

const router = Router();

// GET /api/graph/expand?nodeType=Technology&nodeId=javascript&depth=1
router.get('/expand', graphController.expandNode);

export default router;
