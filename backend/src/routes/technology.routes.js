import { Router } from 'express';
import technologyController from '../controllers/technology.controller.js';

const router = Router();

// Specific routes MUST come before /:name
router.get('/:name/community', technologyController.getCommunity);
router.get('/:name', technologyController.getTechnology);

export default router;
