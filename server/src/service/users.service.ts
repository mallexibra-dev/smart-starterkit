import { db } from '../../utils/db'

export interface User {
  id: number
  name: string
  email: string
  created_at: Date
}

export class ExampleService {
  async getAllUsers(): Promise<User[]> {
    try {
      const [rows] = await db.execute('SELECT * FROM users ORDER BY created_at DESC')
      return rows as User[]
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id])
      const users = rows as User[]
      return users.length > 0 ? users[0] as User : null
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
    }
  }

  async createUser(name: string, email: string): Promise<User> {
    try {
      const [result] = await db.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
      )
      const insertResult = result as any
      return {
        id: insertResult.insertId,
        name,
        email,
        created_at: new Date()
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  async updateUser(id: number, name: string, email: string): Promise<User | null> {
    try {
      const [result] = await db.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      )
      const updateResult = result as any
      
      if (updateResult.affectedRows === 0) {
        return null
      }

      return await this.getUserById(id)
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id])
      const deleteResult = result as any
      return deleteResult.affectedRows > 0
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }
}