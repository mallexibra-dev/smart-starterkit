import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { AuthController } from '../controller/auth.controller'
import { AuthOk, BaseError, BaseOk, LoginBody, MeOk, RefreshBody, RefreshOk, RegisterBody } from '../schemas/auth.schema'

const router = new OpenAPIHono()
const controller = new AuthController()

router.openapi(
  createRoute({
    method: 'post',
    path: '/register',
    request: {
      body: { content: { 'application/json': { schema: RegisterBody } }, required: true },
    },
    responses: {
      201: { description: 'Registrasi berhasil', content: { 'application/json': { schema: AuthOk } } },
      409: { description: 'Conflict', content: { 'application/json': { schema: BaseError } } },
      422: { description: 'Validasi gagal', content: { 'application/json': { schema: BaseError } } },
      500: { description: 'Server Error', content: { 'application/json': { schema: BaseError } } },
    },
    tags: ['Auth'],
    summary: 'Register user baru',
  }),
  (c) => controller.register(c)
)

router.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    request: {
      body: { content: { 'application/json': { schema: LoginBody } }, required: true },
    },
    responses: {
      200: { description: 'Login berhasil', content: { 'application/json': { schema: AuthOk } } },
      401: { description: 'Kredensial tidak valid', content: { 'application/json': { schema: BaseError } } },
      422: { description: 'Validasi gagal', content: { 'application/json': { schema: BaseError } } },
      500: { description: 'Server Error', content: { 'application/json': { schema: BaseError } } },
    },
    tags: ['Auth'],
    summary: 'Login dengan username/email dan password',
  }),
  (c) => controller.login(c)
)

router.openapi(
  createRoute({
    method: 'get',
    path: '/me',
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Profil user', content: { 'application/json': { schema: MeOk } } },
      401: { description: 'Unauthorized', content: { 'application/json': { schema: BaseError } } },
      404: { description: 'User tidak ditemukan', content: { 'application/json': { schema: BaseError } } },
      500: { description: 'Server Error', content: { 'application/json': { schema: BaseError } } },
    },
    tags: ['Auth'],
    summary: 'Ambil profil dari access token',
  }),
  (c) => controller.me(c)
)

router.openapi(
  createRoute({
    method: 'post',
    path: '/refresh',
    request: { body: { content: { 'application/json': { schema: RefreshBody } } } },
    responses: {
      200: { description: 'Token diperbarui', content: { 'application/json': { schema: RefreshOk } } },
      400: { description: 'Bad Request', content: { 'application/json': { schema: BaseError } } },
      401: { description: 'Unauthorized', content: { 'application/json': { schema: BaseError } } },
      500: { description: 'Server Error', content: { 'application/json': { schema: BaseError } } },
    },
    tags: ['Auth'],
    summary: 'Perbarui access token menggunakan refresh token',
  }),
  (c) => controller.refresh(c)
)

router.openapi(
  createRoute({
    method: 'post',
    path: '/logout',
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Logout berhasil', content: { 'application/json': { schema: BaseOk } } },
      401: { description: 'Unauthorized', content: { 'application/json': { schema: BaseError } } },
      500: { description: 'Server Error', content: { 'application/json': { schema: BaseError } } },
    },
    tags: ['Auth'],
    summary: 'Logout dan hapus sesi aktif',
  }),
  (c) => controller.logout(c)
)

export default router 