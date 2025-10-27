---
title: "Building REST APIs with Hono"
excerpt: "Discover how to create fast, type-safe APIs using the modern Hono framework for Node.js and edge environments."
author: "Smart Starterkit Team"
publishedAt: "2024-11-10"
tags: ["Hono", "Backend", "API", "TypeScript", "Tutorial"]
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop"
---

# Building REST APIs with Hono

Hono is a modern, lightweight web framework that's perfect for building fast APIs. It works seamlessly with TypeScript and runs anywhere - Node.js, Deno, Cloudflare Workers, and more.

## What is Hono?

Hono is a web framework that prioritizes:
- **Performance**: Ultra-fast routing and middleware
- **Type Safety**: First-class TypeScript support
- **Portability**: Runs on multiple JavaScript runtimes
- **Simplicity**: Minimal and intuitive API design

## Getting Started

### Installation
```bash
npm install hono
```

### Basic Server
```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Hello, Hono!' });
});

app.get('/api/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ userId: id });
});

export default {
  fetch: app.fetch,
  port: 3000,
};
```

## Routing

Hono provides a clean and powerful routing system:

### Basic Routes
```typescript
import { Hono } from 'hono';

const app = new Hono();

// GET requests
app.get('/users', listUsers);
app.get('/users/:id', getUser);

// POST requests
app.post('/users', createUser);

// PUT requests
app.put('/users/:id', updateUser);

// DELETE requests
app.delete('/users/:id', deleteUser);

async function listUsers(c: Context) {
  const users = await db.users.findMany();
  return c.json(users);
}

async function getUser(c: Context) {
  const id = c.req.param('id');
  const user = await db.users.findUnique({ where: { id } });

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
}
```

### Route Groups
Organize related routes:

```typescript
const api = new Hono();

const users = new Hono();
users.get('/', listUsers);
users.post('/', createUser);
users.get('/:id', getUser);
users.put('/:id', updateUser);
users.delete('/:id', deleteUser);

api.route('/users', users);

app.route('/api', api);
```

## Middleware

Middleware functions run before your route handlers:

### Built-in Middleware
```typescript
import { cors, logger } from 'hono/middleware';

app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
```

### Custom Middleware
```typescript
// Authentication middleware
const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization');

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await verifyToken(token);
  if (!user) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('user', user);
  await next();
};

// Apply to protected routes
app.use('/api/protected/*', authMiddleware);
```

## Request Validation with Zod

Hono integrates beautifully with Zod for request validation:

```typescript
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

app.post('/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');

  const user = await db.users.create({
    data: {
      name: data.name,
      email: data.email,
      age: data.age,
    },
  });

  return c.json(user, 201);
});
```

## Error Handling

Hono provides built-in error handling that you can customize:

```typescript
import { HTTPException } from 'hono/http-exception';

// Custom error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      error: err.message,
      status: err.status,
    }, err.status);
  }

  console.error(err);
  return c.json({
    error: 'Internal Server Error',
  }, 500);
});

// Throwing errors
app.get('/users/:id', async (c) => {
  const id = c.req.param('id');

  if (!isValidId(id)) {
    throw new HTTPException(400, { message: 'Invalid user ID' });
  }

  const user = await db.users.findUnique({ where: { id } });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return c.json(user);
});
```

## Working with Databases

### Using Drizzle ORM
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from './db/schema';

const db = drizzle(process.env.DATABASE_URL);

app.get('/users', async (c) => {
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

app.post('/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');

  const newUser = await db.insert(users).values(data).returning();
  return c.json(newUser[0], 201);
});
```

## OpenAPI Documentation

Hono can automatically generate OpenAPI documentation:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';

const app = new OpenAPIHono();

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

app.openapi(
  {
    method: 'get',
    path: '/users/{id}',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: UserSchema,
          },
        },
        description: 'Get user by ID',
      },
    },
  },
  async (c) => {
    const id = c.req.param('id');
    const user = await getUserById(id);
    return c.json(user);
  }
);

// Generate docs
app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});
```

## Environment Variables

Handle environment variables safely:

```typescript
import { getRuntimeKey } from 'hono/adapter';

const app = new Hono<{ Bindings: Env }>();

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  API_KEY: string;
}

app.get('/env', (c) => {
  return c.json({
    runtime: getRuntimeKey(),
    databaseUrl: c.env.DATABASE_URL,
  });
});
```

## Testing Hono Apps

Hono makes testing straightforward:

```typescript
import { describe, it, expect } from 'vitest';
import app from './app';

describe('User API', () => {
  it('should get users', async () => {
    const res = await app.request('/users');
    expect(res.status).toBe(200);

    const users = await res.json();
    expect(Array.isArray(users)).toBe(true);
  });

  it('should create user', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const res = await app.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(res.status).toBe(201);

    const createdUser = await res.json();
    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
  });
});
```

## Deployment

Hono apps can be deployed to various platforms:

### Vercel
```javascript
// api/index.js
import app from '../app';

export default app;
```

### Cloudflare Workers
```javascript
// worker.js
import app from './app';

export default {
  fetch: app.fetch,
};
```

### Node.js
```javascript
// index.js
import { serve } from '@hono/node-server';
import app from './app';

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

## Best Practices

### 1. Use TypeScript Strict Mode
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
  }
}
```

### 2. Structure Your App
```
src/
├── routes/
│   ├── users.ts
│   └── posts.ts
├── middleware/
│   └── auth.ts
├── schemas/
│   └── validation.ts
├── utils/
│   └── database.ts
└── app.ts
```

### 3. Use Environment Types
```typescript
interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();
```

### 4. Handle Errors Gracefully
```typescript
app.use('*', async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
```

## Conclusion

Hono is an excellent choice for building modern APIs. Its TypeScript-first approach, excellent performance, and cross-platform compatibility make it perfect for everything from small microservices to large-scale applications.

With its clean API design and powerful features, Hono helps you build better APIs faster. Give it a try in your next project! 🚀