import type { Context } from 'hono'
import { UserService } from '../service/user.service'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async getUsers(c: Context) {
    try {
      const users = await this.userService.getUsers()
      
      return c.json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      }, 200)
    } catch (error) {
      console.error('Error getting users:', error)
      
      return c.json({
        success: false,
        message: 'Failed to retrieve users',
      }, 500)
    }
  }
}
