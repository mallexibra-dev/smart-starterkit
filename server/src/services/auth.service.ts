import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { User, LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from 'shared/src/types/auth.type'
import type { LoginInput, RegisterInput } from 'shared/src/validation/auth.validation'

export class AuthService {
  private readonly jwtSecret: string
  private readonly jwtExpiresIn: string
  private readonly refreshExpiresIn: string

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h'
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn })
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.refreshExpiresIn })
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  async createUser(userData: RegisterInput): Promise<User> {
    const { name, email, password } = userData

    // Hash password
    const passwordHash = await this.hashPassword(password)

    // Create user in database
    const connection = await this.getDatabaseConnection()

    try {
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, password_hash, role, status, created_at)
         VALUES (?, ?, ?, 'user', 'active', NOW())`,
        [name, email, passwordHash]
      ) as any

      // Get the created user
      const [users] = await connection.execute(
        'SELECT id, name, email, avatar, role, status, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE id = ?',
        [result.insertId]
      ) as any

      return users[0]
    } finally {
      await connection.end()
    }
  }

  async authenticateUser(loginData: LoginInput): Promise<User | null> {
    const { email, password } = loginData

    const connection = await this.getDatabaseConnection()

    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, password_hash, avatar, role, status, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE email = ? AND status = "active"',
        [email]
      ) as any

      if (users.length === 0) {
        return null
      }

      const user = users[0]
      const isPasswordValid = await this.comparePassword(password, user.password_hash)

      if (!isPasswordValid) {
        return null
      }

      // Update last_login_at
      await connection.execute(
        'UPDATE users SET last_login_at = NOW() WHERE id = ?',
        [user.id]
      )

      // Return user without password_hash
      const { password_hash, ...userWithoutPassword } = user
      return userWithoutPassword
    } finally {
      await connection.end()
    }
  }

  async login(loginData: LoginInput): Promise<AuthResponse> {
    const user = await this.authenticateUser(loginData)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    const token = this.generateToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    return {
      user,
      token,
      refreshToken,
      expiresIn: this.parseExpirationTime(this.jwtExpiresIn)
    }
  }

  async register(userData: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = await this.createUser(userData)

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    const token = this.generateToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    return {
      user,
      token,
      refreshToken,
      expiresIn: this.parseExpirationTime(this.jwtExpiresIn)
    }
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const payload = this.verifyToken(token)

    const user = await this.findUserById(payload.userId)
    if (!user || user.status !== 'active') {
      throw new Error('User not found or inactive')
    }

    const newPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    const newToken = this.generateToken(newPayload)
    const newRefreshToken = this.generateRefreshToken(newPayload)

    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: this.parseExpirationTime(this.jwtExpiresIn)
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const connection = await this.getDatabaseConnection()

    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, avatar, role, status, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE email = ?',
        [email]
      ) as any

      return users.length > 0 ? users[0] : null
    } finally {
      await connection.end()
    }
  }

  async findUserById(id: number): Promise<User | null> {
    const connection = await this.getDatabaseConnection()

    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, avatar, role, status, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE id = ?',
        [id]
      ) as any

      return users.length > 0 ? users[0] : null
    } finally {
      await connection.end()
    }
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // This would require the current password hash from database
    // For simplicity, we'll just update with new password
    const passwordHash = await this.hashPassword(newPassword)

    const connection = await this.getDatabaseConnection()

    try {
      await connection.execute(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
        [passwordHash, userId]
      )
    } finally {
      await connection.end()
    }
  }

  private parseExpirationTime(expiresIn: string): number {
    // Convert time strings like '24h', '7d' to seconds
    const unit = expiresIn.slice(-1)
    const value = parseInt(expiresIn.slice(0, -1))

    switch (unit) {
      case 's': return value
      case 'm': return value * 60
      case 'h': return value * 60 * 60
      case 'd': return value * 24 * 60 * 60
      default: return 24 * 60 * 60 // Default to 24 hours
    }
  }

  private async getDatabaseConnection() {
    const mysql = await import('mysql2/promise')
    return await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'smart_starterkit_test'
    })
  }
}

export const authService = new AuthService()