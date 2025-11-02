import { z } from '@hono/zod-openapi'

export const User = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Alice Example' }),
  username: z.string().openapi({ example: 'alice' }),
  email: z.string().nullable().openapi({ example: 'alice@example.com' }),
}).openapi('User')

export const Base = z.object({
  success: z.boolean(),
  message: z.string().openapi({ example: 'OK' }),
}).openapi('Base')

export const BaseOk = Base
export const BaseError = Base

export const RegisterBody = z.object({
  name: z.string().min(1).max(191),
  username: z.string().min(3).max(191).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().email().max(191).optional().nullable(),
  password: z.string().min(6).max(255),
}).openapi('RegisterBody')

export const LoginBody = z.object({
  identifier: z.string().min(1).max(191),
  password: z.string().min(6).max(255),
}).openapi('LoginBody')

export const RefreshBody = z.object({
  refresh_token: z.string().min(1).max(1024).optional(),
}).openapi('RefreshBody')

export const AuthHeader = z.object({
  Authorization: z.string().openapi({ example: 'Bearer <access_token>' }),
}).openapi('AuthHeader')

export const AuthPayload = z.object({
  user: User,
  access_token: z.string().openapi({ example: 'uuid-access-token' }),
  access_expires_at: z.string().openapi({ example: '2025-09-16T12:34:56.000Z' }),
  refresh_token: z.string().openapi({ example: 'hex-refresh-token' }),
  refresh_expires_at: z.string().openapi({ example: '2025-09-23T12:34:56.000Z' }),
}).openapi('AuthPayload')

export const AuthOk = BaseOk.extend({ data: AuthPayload }).openapi('AuthOk')

export const MeOk = BaseOk.extend({ data: User }).openapi('MeOk')

export const RefreshOk = BaseOk.extend({
  data: z.object({
    access_token: z.string(),
    access_expires_at: z.string(),
    refresh_token: z.string(),
    refresh_expires_at: z.string(),
  }).openapi('RefreshPayload'),
}).openapi('RefreshOk')
