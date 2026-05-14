import express, { type Express } from 'express';
import healthRoutes from "./routes/health.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app: Express = express();

app.use(express.json());
app.use('/health', healthRoutes);
app.use('/tasks', taskRoutes);

export default app;
