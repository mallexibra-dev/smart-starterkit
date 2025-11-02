import { db } from '../../utils/db'

export interface AuthUser {
  id: number
  name: string
  username: string
  email: string | null
  password: string | null
  created_at: Date
}

export interface SessionRecord {
  id: string
  user_id: number
  expires_at: Date
  refresh_token: string
  refresh_expires_at: Date
  created_at: Date
}

export class AuthService {
  async findUserByUsernameOrEmail(identifier: string): Promise<AuthUser | null> {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    )
    const users = rows as AuthUser[]
    return users.length > 0 ? users[0] as AuthUser : null
  }

  async findUserById(id: number): Promise<AuthUser | null> {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
    const users = rows as AuthUser[]
    return users.length > 0 ? users[0] as AuthUser : null
  }

  async createUser(input: { name: string; username: string; email?: string | null; password: string }): Promise<AuthUser> {
    const passwordHash = await Bun.password.hash(input.password)
    const [result] = await db.execute(
      'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
      [input.name, input.username, input.email ?? null, passwordHash]
    )
    const insertResult = result as any

    return {
      id: insertResult.insertId,
      name: input.name,
      username: input.username,
      email: input.email ?? null,
      password: passwordHash,
      created_at: new Date(),
    }
  }

  async verifyPassword(plain: string, hashed: string | null): Promise<boolean> {
    if (!hashed) return false
    return await Bun.password.verify(plain, hashed)
  }

  async createSession(userId: number, accessTtlMinutes = 15, refreshTtlDays = 7): Promise<SessionRecord> {
    const id = crypto.randomUUID()
    const refreshToken = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')

    const now = new Date()
    const expiresAt = new Date(now.getTime() + accessTtlMinutes * 60 * 1000)
    const refreshExpiresAt = new Date(now.getTime() + refreshTtlDays * 24 * 60 * 60 * 1000)

    await db.execute(
      'INSERT INTO sessions (id, user_id, expires_at, refresh_token, refresh_expires_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, this.toMySQLDateTime(expiresAt), refreshToken, this.toMySQLDateTime(refreshExpiresAt)]
    )

    return {
      id,
      user_id: userId,
      expires_at: expiresAt,
      refresh_token: refreshToken,
      refresh_expires_at: refreshExpiresAt,
      created_at: now,
    }
  }

  async getSessionById(id: string): Promise<SessionRecord | null> {
    const [rows] = await db.execute('SELECT * FROM sessions WHERE id = ? LIMIT 1', [id])
    const sessions = rows as SessionRecord[]
    return sessions.length ? this.hydrateSession(sessions[0]) : null
  }

  async getSessionByRefreshToken(refreshToken: string): Promise<SessionRecord | null> {
    const [rows] = await db.execute('SELECT * FROM sessions WHERE refresh_token = ? LIMIT 1', [refreshToken])
    const sessions = rows as SessionRecord[]
    return sessions.length ? this.hydrateSession(sessions[0]) : null
  }

  async deleteSession(id: string): Promise<void> {
    await db.execute('DELETE FROM sessions WHERE id = ?', [id])
  }

  async deleteSessionByRefresh(refreshToken: string): Promise<void> {
    await db.execute('DELETE FROM sessions WHERE refresh_token = ?', [refreshToken])
  }

  async rotateSession(oldRefreshToken: string, accessTtlMinutes = 15, refreshTtlDays = 7): Promise<SessionRecord | null> {
    const session = await this.getSessionByRefreshToken(oldRefreshToken)
    if (!session) return null

    // remove old
    await this.deleteSession(session.id)

    // create new
    return await this.createSession(session.user_id, accessTtlMinutes, refreshTtlDays)
  }

  isExpired(date: Date): boolean {
    return date.getTime() <= Date.now()
  }

  private hydrateSession(raw: any): SessionRecord {
    return {
      id: raw.id,
      user_id: typeof raw.user_id === 'string' ? parseInt(raw.user_id, 10) : raw.user_id,
      expires_at: new Date(raw.expires_at),
      refresh_token: raw.refresh_token,
      refresh_expires_at: new Date(raw.refresh_expires_at),
      created_at: new Date(raw.created_at),
    }
  }

  private toMySQLDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    const y = date.getFullYear()
    const m = pad(date.getMonth() + 1)
    const d = pad(date.getDate())
    const h = pad(date.getHours())
    const mi = pad(date.getMinutes())
    const s = pad(date.getSeconds())
    return `${y}-${m}-${d} ${h}:${mi}:${s}`
  }
} 