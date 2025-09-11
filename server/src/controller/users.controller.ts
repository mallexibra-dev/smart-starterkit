import type { Context } from 'hono'
import { ExampleService, type User } from '../service/users.service'
import type { ApiResponse } from 'shared/dist'

export class ExampleController {
  private exampleService: ExampleService

  constructor() {
    this.exampleService = new ExampleService()
  }

  async getAllUsers(c: Context) {
    try {
      const users = await this.exampleService.getAllUsers()
      const response: ApiResponse & { data: User[] } = {
        message: 'Users fetched successfully',
        success: true,
        data: users
      }
      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        message: 'Failed to fetch users',
        success: false
      }
      return c.json(response, 500)
    }
  }

  async getUserById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          message: 'Invalid user ID',
          success: false
        }
        return c.json(response, 400)
      }

      const user = await this.exampleService.getUserById(id)
      
      if (!user) {
        const response: ApiResponse = {
          message: 'User not found',
          success: false
        }
        return c.json(response, 404)
      }

      const response: ApiResponse & { data: User } = {
        message: 'User fetched successfully',
        success: true,
        data: user
      }
      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        message: 'Failed to fetch user',
        success: false
      }
      return c.json(response, 500)
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json()
      const { name, email } = body as { name: string; email: string }
      const user = await this.exampleService.createUser(name, email)
      
      const response: ApiResponse & { data: User } = {
        message: 'User created successfully',
        success: true,
        data: user
      }
      return c.json(response, 201)
    } catch (error) {
      const response: ApiResponse = {
        message: 'Failed to create user',
        success: false
      }
      return c.json(response, 500)
    }
  }

  async updateUser(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          message: 'Invalid user ID',
          success: false
        }
        return c.json(response, 400)
      }

      const body = await c.req.json()
      const { name, email } = body as { name: string; email: string }
      const user = await this.exampleService.updateUser(id, name, email)
      
      if (!user) {
        const response: ApiResponse = {
          message: 'User not found',
          success: false
        }
        return c.json(response, 404)
      }

      const response: ApiResponse & { data: User } = {
        message: 'User updated successfully',
        success: true,
        data: user
      }
      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        message: 'Failed to update user',
        success: false
      }
      return c.json(response, 500)
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      
      if (isNaN(id)) {
        const response: ApiResponse = {
          message: 'Invalid user ID',
          success: false
        }
        return c.json(response, 400)
      }

      const deleted = await this.exampleService.deleteUser(id)
      
      if (!deleted) {
        const response: ApiResponse = {
          message: 'User not found',
          success: false
        }
        return c.json(response, 404)
      }

      const response: ApiResponse = {
        message: 'User deleted successfully',
        success: true
      }
      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        message: 'Failed to delete user',
        success: false
      }
      return c.json(response, 500)
    }
  }
}
