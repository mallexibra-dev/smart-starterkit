import { setCookie } from 'hono/cookie';
import { UserService } from '../service/auth.service';
import { AuthService } from '../lib/auth';

export class AuthController {
  static async signUp(c: any) {
    try {
      const { name, email, password } = c.req.valid("json");

      const user = await UserService.createUser({ name, email, password });
      const token = AuthService.generateToken(user);

      setCookie(c, 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return c.json({
        success: true,
        message: "Registration successful",
        data: {
          user,
        },
      });
    } catch (error: any) {
      console.error('Sign-up error:', error);
      const userMessage = getUserFriendlyError(error);
      return c.json({
        success: false,
        message: userMessage,
      }, 400);
    }
  }

  static async signIn(c: any) {
    try {
      const { email, password } = c.req.valid("json");

      const user = await UserService.authenticateUser({ email, password });
      const token = AuthService.generateToken(user);

      setCookie(c, 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return c.json({
        success: true,
        message: "Login successful",
        data: {
          user,
        },
      });
    } catch (error: any) {
      console.error('Sign-in error:', error);
      return c.json({
        success: false,
        message: "Authentication failed. Please try again.",
      }, 401);
    }
  }

  static async getCurrentUser(c: any) {
    try {
      const token = AuthService.extractTokenFromCookie(c.req.header('cookie'));

      if (!token) {
        return c.json({
          success: false,
          message: "No token provided",
        }, 401);
      }

      const payload = AuthService.verifyToken(token);

      if (!payload) {
        return c.json({
          success: false,
          message: "Invalid token",
        }, 401);
      }

      const user = await UserService.getUserById(payload.id);

      if (!user) {
        return c.json({
          success: false,
          message: "User not found",
        }, 404);
      }

      return c.json({
        success: true,
        data: {
          user,
        },
      });
    } catch (error: any) {
      console.error('Get user error:', error);
      return c.json({
        success: false,
        message: "Failed to get user",
      }, 500);
    }
  }

  static async signOut(c: any) {
    setCookie(c, 'token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return c.json({
      success: true,
      message: "Logout successful",
    });
  }
}

function getUserFriendlyError(error: any): string {
  if (error.message?.includes('Duplicate entry') || error.message?.includes('UNIQUE constraint failed')) {
    return 'Email already registered. Please use another email.';
  }

  if (error.message?.includes('Invalid credentials') || error.message?.includes('password')) {
    return 'Invalid email or password';
  }

  if (error.message?.includes('User not found')) {
    return 'No account found with this email';
  }

  return 'Authentication failed. Please try again.';
}
