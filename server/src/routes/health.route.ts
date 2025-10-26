import { Hono } from 'hono';
import { db } from '../utils/db';

const app = new Hono();

// Simple health check
app.get('/health', async (c) => {
  try {
    // Check database connection
    await db.execute('SELECT 1');

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, 503);
  }
});

export default app;