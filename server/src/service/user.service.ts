import { db } from '../../utils/db'

export interface User {
  id: number
  name: string
  username: string
  email: string | null
  created_at: string
  updated_at: string | null
}

export class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const [rows] = await db.execute(
        'SELECT id, name, username, email, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC'
      )
      
      return rows as User[]
    } catch (error) {
      console.error('Error getting users:', error)
      throw new Error('Failed to retrieve users')
    }
  }
}
