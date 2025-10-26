import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

export { db, schema };

// Export tables for convenience
export const { users } = schema;

// Export types
export type { User, NewUser } from './schema';