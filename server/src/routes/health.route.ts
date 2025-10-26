import { Hono } from 'hono';
import { db } from '../db';

const app = new Hono();

// Simple health check
app.get('/health', async (c) => {
  try {
    // Check database connection using Drizzle
    await db.execute('SELECT 1');

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'PostgreSQL'
    });
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL'
    }, 503);
  }
});

export default app;