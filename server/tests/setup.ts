import { vi, afterEach } from 'vitest'
import mysql from 'mysql2/promise'

// Mock MySQL connection
vi.mock('mysql2/promise', () => ({
  default: {
    createConnection: vi.fn(() => Promise.resolve({
      query: vi.fn(),
      execute: vi.fn(),
      beginTransaction: vi.fn(),
      commit: vi.fn(),
      rollback: vi.fn(),
      end: vi.fn(),
    })),
    createPool: vi.fn(() => ({
      getConnection: vi.fn(),
      query: vi.fn(),
      execute: vi.fn(),
      end: vi.fn(),
    })),
  },
}))

// Mock Winston logger
vi.mock('winston', () => ({
  default: {
    createLogger: vi.fn(() => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    })),
    format: {
      combine: vi.fn(),
      timestamp: vi.fn(),
      errors: vi.fn(),
      json: vi.fn(),
      simple: vi.fn(),
    },
    transports: {
      Console: vi.fn(),
      File: vi.fn(),
    },
  },
}))

// Set test environment
process.env.NODE_ENV = 'test'

// Simple test client that uses environment variables
export const createTestClient = () => ({
  get: async (path: string) => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${path}`)
    return {
      status: response.status,
      body: await response.json(),
      headers: Object.fromEntries(response.headers.entries())
    }
  },

  post: async (path: string, data?: any) => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined
    })
    return {
      status: response.status,
      body: await response.json(),
      headers: Object.fromEntries(response.headers.entries())
    }
  },

  put: async (path: string, data?: any) => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined
    })
    return {
      status: response.status,
      body: await response.json(),
      headers: Object.fromEntries(response.headers.entries())
    }
  },

  delete: async (path: string) => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'DELETE'
    })
    return {
      status: response.status,
      body: await response.json(),
      headers: Object.fromEntries(response.headers.entries())
    }
  }
})

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})