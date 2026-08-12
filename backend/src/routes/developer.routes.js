import { Router } from 'express';
import developerController from '../controllers/developer.controller.js';
import connectionController from '../controllers/connection.controller.js';

const router = Router();

// Specific routes MUST come before /:username
router.get('/:username/network', developerController.getNetwork);
router.get('/:username/connections', connectionController.getConnectedDevelopers);
router.get('/:username', developerController.getDeveloper);

export default router;
