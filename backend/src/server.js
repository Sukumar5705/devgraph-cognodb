import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';
import { verifyConnection } from './database/neo4j.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  const dbConnected = await verifyConnection();
  if (!dbConnected) {
    logger.warn('Starting server without graph database connection.');
  }

  app.listen(PORT, () => {
    logger.info(`DevGraph Backend running on port ${PORT}`);
  });
}

startServer();
