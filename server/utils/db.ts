import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_starterkit',
});

const originalExecute = db.execute.bind(db) as (sql: string, params?: any[]) => Promise<any>
;(db as any).execute = async (sql: string, params?: any[]) => {
  const start = Date.now()
  console.log('[SQL START]', { sql, params })
  try {
    const result = await originalExecute(sql, params)
    const durationMs = Date.now() - start
    console.log('[SQL DONE]', { sql, durationMs })
    return result
  } catch (error: any) {
    const durationMs = Date.now() - start
    console.error('[SQL ERROR]', { sql, durationMs, error: error?.message })
    throw error
  }
}