import { Router } from 'express';
import { verifyConnection } from '../database/neo4j.js';

const router = Router();

router.get('/', async (req, res) => {
  const dbConnected = await verifyConnection();
  if (dbConnected) {
    res.json({ success: true, database: 'connected' });
  } else {
    res.status(503).json({
      success: false,
      database: 'unavailable',
      error: { code: 'DATABASE_UNAVAILABLE', message: 'Graph database is currently unavailable.' }
    });
  }
});

export default router;
