import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { AuthController } from '../controller/auth.controller';
import { authRateLimit } from '../middlewares/rate-limit.middleware';
import { validateJson } from '../middlewares/validations.middleware';
import { registerSchema, loginSchema } from '../../../shared/src/validation/auth.validation';

const app = new OpenAPIHono();

// OpenAPI response schemas
const UserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  }),
});

const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const MessageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Apply middleware first
app.use('/sign-up', authRateLimit, validateJson(registerSchema));
app.use('/sign-in', authRateLimit, validateJson(loginSchema));

// Sign Up route with OpenAPI documentation
app.openapi(
  createRoute({
    method: 'post',
    path: '/auth/sign-up',
    tags: ['Authentication'],
    summary: 'Register a new user',
    description: 'Create a new user account with email and password',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              email: z.string().email(),
              password: z.string().min(8),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserResponseSchema,
          },
        },
        description: 'User successfully registered',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'Bad request - Validation error or user already exists',
      },
      429: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'Too many requests',
      },
    },
  }),
  AuthController.signUp
);

// Sign In route with OpenAPI documentation
app.openapi(
  createRoute({
    method: 'post',
    path: '/auth/sign-in',
    tags: ['Authentication'],
    summary: 'Sign in user',
    description: 'Authenticate user with email and password',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              email: z.string().email(),
              password: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserResponseSchema,
          },
        },
        description: 'User successfully signed in',
      },
      401: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'Unauthorized - Invalid credentials',
      },
      429: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'Too many requests',
      },
    },
  }),
  AuthController.signIn
);

// Get Current User route with OpenAPI documentation
app.openapi(
  createRoute({
    method: 'get',
    path: '/auth/me',
    tags: ['Authentication'],
    summary: 'Get current user',
    description: 'Get the currently authenticated user information',
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserResponseSchema,
          },
        },
        description: 'Current user information retrieved successfully',
      },
      401: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'Unauthorized - No or invalid token',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'User not found',
      },
      500: {
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
        description: 'Internal server error',
      },
    },
  }),
  AuthController.getCurrentUser
);

// Sign Out route with OpenAPI documentation
app.openapi(
  createRoute({
    method: 'post',
    path: '/auth/sign-out',
    tags: ['Authentication'],
    summary: 'Sign out user',
    description: 'Sign out the current user and clear the authentication cookie',
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: MessageResponseSchema,
          },
        },
        description: 'User successfully signed out',
      },
    },
  }),
  AuthController.signOut
);

export default app; 