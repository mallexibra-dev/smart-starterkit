import { Hono } from "hono";
import authRoutes from './auth.route';
import healthRoutes from './health.route';
import { requestLogger } from '../middlewares/logs.middleware';

const app = new Hono();

// Middleware
app.use('*', requestLogger);

// Routes
app.route('/api/auth', authRoutes);
app.route('/api', healthRoutes);

export default app;
