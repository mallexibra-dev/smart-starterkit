import { Hono } from "hono";
import healthRoutes from './health.route';
import { requestLogger } from '../middlewares/logs.middleware';

const app = new Hono();

// Middleware
app.use('*', requestLogger);

// Routes
app.route('/', healthRoutes);

export default app;
