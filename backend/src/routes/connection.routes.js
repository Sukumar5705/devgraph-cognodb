import { Router } from 'express';
import connectionController from '../controllers/connection.controller.js';

const router = Router();

router.get('/', connectionController.getDeveloperPath);
router.get('/:username', connectionController.getConnectedDevelopers);

export default router;
