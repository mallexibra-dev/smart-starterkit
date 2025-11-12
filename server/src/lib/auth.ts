import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { User } from '../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  id: number;
  email: string;
  name: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: Pick<User, 'id' | 'email' | 'name'>): string {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }

  static extractTokenFromCookie(cookieHeader?: string): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('token='));

    return tokenCookie ? tokenCookie.substring(6) : null;
  }

  static async getUserFromToken(token: string): Promise<JWTPayload | null> {
    const payload = this.verifyToken(token);
    return payload;
  }
}

export default AuthService;