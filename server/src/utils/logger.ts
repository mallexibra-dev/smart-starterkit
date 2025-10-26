import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'

const logsDir = path.resolve(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const timestampFormat = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
const jsonFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  return JSON.stringify({ timestamp, level, message, ...meta })
})

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(timestampFormat, jsonFormat),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
        })
      ),
    }),
    new transports.File({ filename: path.join(logsDir, `app-${new Date().toISOString().slice(0, 10)}.log`) }),
  ],
})

export default logger
