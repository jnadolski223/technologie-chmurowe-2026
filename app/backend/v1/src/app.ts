import express, { type Express } from 'express';
import healthRoutes from './routes/health.route.js';
import tasksRoutes from './routes/tasks.route.js';

const app: Express = express();

app.use(express.json());
app.use('/health', healthRoutes);
app.use('/tasks', tasksRoutes);

export default app;
