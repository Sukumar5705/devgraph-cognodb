import { Router } from 'express';
import pathController from '../controllers/path.controller.js';

const router = Router();

router.get('/', pathController.getPath);

export default router;
