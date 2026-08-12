import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from './routes/health.routes.js';
import developerRoutes from './routes/developer.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import technologyRoutes from './routes/technology.routes.js';
import graphRoutes from './routes/graph.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/graph', graphRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' }
  });
});

app.use(errorHandler);

export default app;
