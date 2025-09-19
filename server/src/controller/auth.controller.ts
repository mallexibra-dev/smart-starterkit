import type { Context } from "hono";
import type { ApiResponse } from "shared/dist";
import { AuthService } from "../service/auth.service";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async register(c: Context) {
    const body = await c.req.json();
    const { name, username, email, password } = body as {
      name: string;
      username: string;
      email?: string;
      password: string;
    };

    const exist = await this.service.findUserByUsernameOrEmail(username);
    if (exist) {
      const response: ApiResponse = {
        success: false,
        message: "Username sudah dipakai",
      };
      return c.json(response, 409);
    }

    if (email) {
      const existEmail = await this.service.findUserByUsernameOrEmail(email);
      if (existEmail) {
        const response: ApiResponse = {
          success: false,
          message: "Email sudah dipakai",
        };
        return c.json(response, 409);
      }
    }

    const user = await this.service.createUser({
      name,
      username,
      email: email ?? null,
      password,
    });
    const session = await this.service.createSession(user.id);

    this.setAuthCookies(c, session.id, session.refresh_token, String(session.expires_at), String(session.refresh_expires_at));

    const response: ApiResponse & { data: any } = {
      success: true,
      message: "Registrasi berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        access_token: session.id,
        access_expires_at: session.expires_at,
        refresh_token: session.refresh_token,
        refresh_expires_at: session.refresh_expires_at,
      },
    };
    return c.json(response, 201);
  }

  async login(c: Context) {
    const body = await c.req.json();
    const { identifier, password } = body as {
      identifier: string;
      password: string;
    };

    const user = await this.service.findUserByUsernameOrEmail(identifier);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User tidak ditemukan",
      };
      return c.json(response, 401);
    }

    const ok = await this.service.verifyPassword(password, user.password);
    if (!ok) {
      const response: ApiResponse = {
        success: false,
        message: "Username/Email atau Password salah",
      };
      return c.json(response, 401);
    }

    const session = await this.service.createSession(user.id);
    console.log(session);

    this.setAuthCookies(c, session.id, session.refresh_token, String(session.expires_at), String(session.refresh_expires_at));

    const response: ApiResponse & { data: any } = {
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        access_token: session.id,
        access_expires_at: session.expires_at,
        refresh_token: session.refresh_token,
        refresh_expires_at: session.refresh_expires_at,
      },
    };
    return c.json(response, 200);
  }

  async me(c: Context) {
    const token = this.getToken(c);
    if (!token) {
      const response: ApiResponse = { success: false, message: "Unauthorized" };
      return c.json(response, 401);
    }

    const session = await this.service.getSessionById(token);
    if (!session || this.service.isExpired(session.expires_at)) {
      const response: ApiResponse = {
        success: false,
        message: "Token kedaluwarsa",
      };
      return c.json(response, 401);
    }

    const user = await this.service.findUserById(session.user_id);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User tidak ditemukan",
      };
      return c.json(response, 404);
    }

    const response: ApiResponse & { data: any } = {
      success: true,
      message: "OK",
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
    return c.json(response, 200);
  }

  async refresh(c: Context) {
    const body = await c.req.json().catch(() => ({}));
    const { refresh_token } = body as { refresh_token?: string };
    const token = refresh_token || this.getRefreshToken(c);

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: "Refresh token tidak ada",
      };
      return c.json(response, 400);
    }

    const session = await this.service.getSessionByRefreshToken(token);
    if (!session || this.service.isExpired(session.refresh_expires_at)) {
      const response: ApiResponse = {
        success: false,
        message: "Refresh token tidak valid",
      };
      return c.json(response, 401);
    }

    const rotated = await this.service.rotateSession(token);
    if (!rotated) {
      const response: ApiResponse = {
        success: false,
        message: "Gagal membuat sesi baru",
      };
      return c.json(response, 500);
    }

    this.setAuthCookies(c, rotated.id, rotated.refresh_token, String(rotated.expires_at), String(rotated.refresh_expires_at));

    const response: ApiResponse & { data: any } = {
      success: true,
      message: "Token diperbarui",
      data: {
        access_token: rotated.id,
        access_expires_at: rotated.expires_at,
        refresh_token: rotated.refresh_token,
        refresh_expires_at: rotated.refresh_expires_at,
      },
    };
    return c.json(response, 200);
  }

  async logout(c: Context) {
    const token = this.getToken(c);
    if (token) {
      await this.service.deleteSession(token);
    }
    this.clearAuthCookies(c);
    const response: ApiResponse = { success: true, message: "Logout berhasil" };
    return c.json(response, 200);
  }

  private getToken(c: Context): string | null {
    const cookieToken = getCookie(c, 'access_token') || null;
    if (cookieToken) return cookieToken;
    return this.getBearer(c);
  }

  private getRefreshToken(c: Context): string | null {
    const cookieToken = getCookie(c, 'refresh_token') || null;
    if (cookieToken) return cookieToken;
    return this.getBearer(c);
  }

  private getBearer(c: Context): string | null {
    const auth = c.req.header("authorization") || c.req.header("Authorization");
    if (!auth) return null;
    const parts = auth.split(" ");
    if (parts.length !== 2) return null;
    if (parts[0] !== "Bearer") return null;
    return parts[1] ?? null;
  }

  private setAuthCookies(
    c: Context,
    accessToken: string,
    refreshToken: string,
    accessExpiresAt: string,
    refreshExpiresAt: string
  ) {
    const accessMaxAge = Math.max(0, Math.floor((new Date(accessExpiresAt).getTime() - Date.now()) / 1000));
    const refreshMaxAge = Math.max(0, Math.floor((new Date(refreshExpiresAt).getTime() - Date.now()) / 1000));

    setCookie(c, 'access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: accessMaxAge || 60 * 60,
    });

    console.log("cookie ", accessToken);

    setCookie(c, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: refreshMaxAge || 60 * 60 * 24 * 7,
    });
  }

  private clearAuthCookies(c: Context) {
    deleteCookie(c, 'access_token', { path: '/' });
    deleteCookie(c, 'refresh_token', { path: '/' });
  }
}
