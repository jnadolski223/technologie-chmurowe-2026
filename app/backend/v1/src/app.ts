import express, { type Express } from 'express';
import healthRoutes from './routes/health.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app: Express = express();

app.use(express.json());
app.use('/health', healthRoutes);
app.use('/tasks', tasksRoutes);

export default app;
