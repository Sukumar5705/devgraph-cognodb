import logger from '../utils/logger.js';

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'Neo4jError') {
    if (err.code === 'ServiceUnavailable') {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Graph database is currently unavailable.' }
      });
    }
  }

  if (statusCode === 500) {
    logger.error(`[500] ${err.message}`, err.stack);
    if (process.env.NODE_ENV === 'production') {
      message = 'An unexpected error occurred.';
    }
  } else {
    logger.warn(`[${statusCode}] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: { code: err.code || 'API_ERROR', message }
  });
}

export default errorHandler;
