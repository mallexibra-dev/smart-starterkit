import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthService } from '../lib/auth';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}

export class UserService {
  static async createUser(input: CreateUserInput): Promise<AuthUser> {
    const { name, email, password } = input;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Email already registered. Please use another email.');
    }

    const hashedPassword = await AuthService.hashPassword(password);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
    });

    const newUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (newUser.length === 0) {
      throw new Error('Failed to create user');
    }

    const user = newUser[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt || new Date(),
    };
  }

  static async authenticateUser(input: LoginInput): Promise<AuthUser> {
    const { email, password } = input;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      throw new Error('Invalid email or password');
    }

    const foundUser = user[0];
    const isPasswordValid = await AuthService.comparePassword(password, foundUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      emailVerified: foundUser.emailVerified,
      createdAt: foundUser.createdAt || new Date(),
    };
  }

  static async getUserById(id: number): Promise<AuthUser | null> {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const foundUser = user[0];
    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      emailVerified: foundUser.emailVerified,
      createdAt: foundUser.createdAt || new Date(),
    };
  }
}

export default UserService; 