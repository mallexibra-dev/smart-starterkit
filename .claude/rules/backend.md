# Backend Development Rules

## 🏗️ Architecture Principles

### Minimal Architecture Pattern
```
server/src/
├── routes/         # API route definitions ONLY
├── controllers/    # Request handlers ONLY
├── db/            # Database schema, migrations, seeders
├── middlewares/   # Custom middleware
└── utils/         # Utility functions and helpers
```

### 🔧 Key Architecture Rules
- **NO service layer** - keep minimal for developers
- **Route → Controller pattern** only
- **Direct database access** in controllers
- **Middleware** for cross-cutting concerns

## 📁 File Organization

### ✅ Correct File Placement
- **Routes**: Only in `src/routes/`
- **Controllers**: Only in `src/controllers/`
- **Database**: Only in `src/db/`
- **Middleware**: Only in `src/middlewares/`
- **Utils**: Only in `src/utils/`

### ❌ Incorrect Placement
- **NO service files** - use direct controller logic
- **NO business logic outside controllers**
- **NO database access outside controllers**
- **NO files in wrong directories**

## 📝 Naming Conventions

### File Naming
- **Routes**: `{resource}.routes.ts` (e.g., `user.routes.ts`)
- **Controllers**: `{resource}.controller.ts` (e.g., `user.controller.ts`)
- **Middleware**: `{name}.middleware.ts` (e.g., `auth.middleware.ts`)
- **Utils**: `{name}.ts` or `{name}.util.ts`

### Export Patterns
- **Named exports** for routes and controllers
- **Default exports** only for main app files
- **Consistent naming** across route/controller pairs

## 🌐 API Development

### RESTful Route Patterns
```
GET    /api/users          # List users
POST   /api/users          # Create user
GET    /api/users/:id      # Get user by ID
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

### Hono Best Practices
- **OpenAPI integration** with proper documentation
- **Zod validation** for request/response
- **Error handling** with proper HTTP status codes
- **CORS configuration** for frontend communication
- **Structured logging** with Winston

### Route Structure
```typescript
// user.routes.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userController } from '../controllers/user.controller';
import { createUserSchema, updateUserSchema } from 'shared/src/validation';

const userRoutes = new Hono();

userRoutes.get('/', userController.getAll);
userRoutes.post('/', zValidator('json', createUserSchema), userController.create);
userRoutes.get('/:id', userController.getById);
userRoutes.put('/:id', zValidator('json', updateUserSchema), userController.update);
userRoutes.delete('/:id', userController.delete);

export default userRoutes;
```

## 🗄️ Database Operations

### Drizzle ORM Patterns
- **Schema definitions** in `src/db/schema.ts`
- **Type-safe queries** with Drizzle
- **Connection pooling** for performance
- **Transaction handling** when needed
- **Winston logging** for operations

### Controller Structure
```typescript
// user.controller.ts
import { Context } from 'hono';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const userController = {
  getAll: async (c: Context) => {
    try {
      const result = await db.select().from(users);
      return c.json(result);
    } catch (error) {
      console.error('Error fetching users:', error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }
  },

  create: async (c: Context) => {
    try {
      const userData = await c.req.json();
      const result = await db.insert(users).values(userData).returning();
      return c.json(result[0], 201);
    } catch (error) {
      console.error('Error creating user:', error);
      return c.json({ error: 'Failed to create user' }, 500);
    }
  }
};
```

## 🔍 Validation & Error Handling

### Zod Validation
- **Request validation** with `@hono/zod-validator`
- **Response validation** for consistency
- **Shared schemas** from `shared/src/validation`
- **Custom error messages** for better UX

### Error Handling Patterns
- **Consistent error responses** with proper status codes
- **Structured error objects** with messages
- **Logging for debugging** with Winston
- **User-friendly messages** for client consumption

### Example Error Response
```json
{
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  },
  "timestamp": "2025-01-27T10:30:00Z"
}
```

## 🔧 Environment & Configuration

### Environment Variables
```typescript
// .env.local
DATABASE_URL=postgresql://app_user:app_password@localhost:5433/smart_starterkit
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Configuration Management
- **Environment-specific** configurations
- **Secure credential** handling
- **Development vs production** settings
- **Validation of required** environment variables

## 🛡️ Security Best Practices

### API Security
- **Input validation** with Zod schemas
- **SQL injection prevention** with Drizzle ORM
- **CORS configuration** for allowed origins
- **Rate limiting** consideration for production
- **Sanitized outputs** for responses

### Authentication Patterns
- **JWT tokens** for stateless auth
- **Middleware integration** for route protection
- **Secure password** hashing
- **Session management** best practices

## 📊 Logging & Monitoring

### Winston Logging
- **Structured logging** with consistent format
- **Different log levels** (info, warn, error)
- **Request/response logging** for debugging
- **Database operation** logging

### Log Format Example
```json
{
  "timestamp": "2025-01-27T10:30:00Z",
  "level": "info",
  "method": "GET",
  "url": "/api/users",
  "status": 200,
  "duration": 45,
  "ip": "::1"
}
```

## 🚀 Development Workflow

1. **Define schema** in `src/db/schema.ts`
2. **Create validation** schemas in `shared/src/validation`
3. **Create controller** with direct database access
4. **Create routes** with proper validation
5. **Add middleware** if needed
6. **Register routes** in main app
7. **Test endpoints** and error handling
8. **Add documentation** with OpenAPI

## 📋 Quality Checklist

Before completing backend tasks:
- [ ] Routes follow RESTful patterns
- [ ] Controllers have direct database access
- [ ] No service layer created
- [ ] Zod validation implemented
- [ ] Error handling with proper status codes
- [ ] Winston logging added
- [ ] Environment variables configured
- [ ] OpenAPI documentation updated
- [ ] Files are in correct directories
- [ ] Security considerations addressed

**Backend development must maintain minimal architecture!** 🚀