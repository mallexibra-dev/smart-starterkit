import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestClient } from './setup'

// Mock fetch globally
global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe('API Tests', () => {
  let client: any

  beforeEach(() => {
    vi.clearAllMocks()
    client = createTestClient()
  })

  it('should get hello message', async () => {
    // Mock successful fetch response
    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: async () => 'Hello Hono!',
      text: async () => 'Hello Hono!'
    } as Response)

    const response = await client.get('/')

    expect(response.status).toBe(200)
    expect(response.body).toBe('Hello Hono!')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/')
  })

  it('should get API documentation', async () => {
    // Mock HTML response for docs
    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ 'content-type': 'text/html' }),
      json: async () => ({ html: '<html>...</html>' }),
      text: async () => '<html>...</html>'
    } as Response)

    const response = await client.get('/api/docs')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/docs')
  })

  it('should handle not found routes', async () => {
    // Mock 404 response
    mockFetch.mockResolvedValueOnce({
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Not Found' })
    } as Response)

    const response = await client.get('/api/non-existent')

    expect(response.status).toBe(404)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/non-existent')
  })

  it('should handle POST requests', async () => {
    const postData = { name: 'Test User', email: 'test@example.com' }

    // Mock POST response
    mockFetch.mockResolvedValueOnce({
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: postData })
    } as Response)

    const response = await client.post('/api/users', postData)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ success: true, data: postData })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
  })

  it('should handle PUT requests', async () => {
    const updateData = { name: 'Updated User' }

    // Mock PUT response
    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: updateData })
    } as Response)

    const response = await client.put('/api/users/1', updateData)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true, data: updateData })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/users/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
  })

  it('should handle DELETE requests', async () => {
    // Mock DELETE response
    mockFetch.mockResolvedValueOnce({
      status: 204,
      headers: new Headers(),
      json: async () => ({}),
      text: async () => ''
    } as Response)

    const response = await client.delete('/api/users/1')

    expect(response.status).toBe(204)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/users/1', {
      method: 'DELETE'
    })
  })

  it('should use custom API_BASE_URL from environment', async () => {
    // Set custom base URL
    const originalBaseUrl = process.env.API_BASE_URL
    process.env.API_BASE_URL = 'http://api.example.com'

    const customClient = createTestClient()

    mockFetch.mockResolvedValueOnce({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ message: 'Success' })
    } as Response)

    await customClient.get('/test')

    expect(mockFetch).toHaveBeenCalledWith('http://api.example.com/test')

    // Restore original value
    process.env.API_BASE_URL = originalBaseUrl
  })

  it('should handle network errors', async () => {
    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(client.get('/test')).rejects.toThrow('Network error')
  })
})