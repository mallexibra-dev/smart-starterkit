import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Database connection
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'mydatabase',
  connectionLimit: 10,
});

export const db = drizzle(connection, {
  schema,
  mode: 'default',
});

// Export raw connection for custom queries
export const rawConnection = connection;

export * from './schema';