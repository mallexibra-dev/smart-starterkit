# Testing Guide

Comprehensive testing strategies and setup for the Smart Starterkit project with modern testing frameworks and best practices.

## 🏗️ Testing Structure

```
smart-starterkit/
├── client/                    # React 19 + Vite frontend
│   ├── tests/
│   │   ├── components.test.tsx    # React component tests
│   │   ├── utils.test.ts          # Utility function tests
│   │   ├── hooks.test.tsx         # Custom hook tests
│   │   ├── services.test.ts       # TanStack Query service tests
│   │   └── setup.ts              # Client test setup and mocks
│   └── vitest.config.ts          # Client test configuration
├── server/                    # Hono + PostgreSQL backend
│   ├── tests/
│   │   ├── api.test.ts           # API endpoint tests
│   │   ├── controllers.test.ts   # Controller tests
│   │   ├── middleware.test.ts    # Middleware tests
│   │   ├── db.test.ts            # Database operation tests
│   │   └── setup.ts              # Server test setup and mocks
│   └── vitest.config.ts          # Server test configuration
├── shared/                    # Shared types and validation
│   ├── tests/
│   │   ├── types.test.ts         # Type validation tests
│   │   ├── validation.test.ts    # Zod schema tests
│   │   └── utils.test.ts         # Shared utility tests
│   └── vitest.config.ts          # Shared test configuration
└── docs/TESTING.md             # This documentation
```

## 🤖 Testing with Claude Agents

This project includes a **testing-specialist** agent that can help you:

- **Set up comprehensive test suites** for new features
- **Review and improve existing tests**
- **Create testing strategies** for complex scenarios
- **Set up test infrastructure** and mocking strategies

**When to use the testing-specialist agent:**
- "I need to add tests for my new API endpoints"
- "Can you help me test my React component?"
- "I want to improve my test coverage"
- "Set up testing for my new feature"

## 🚀 Running Tests

### Root Level Commands
```bash
# Run all tests (client + server + shared)
bun run test

# Run tests with coverage
bun run test:coverage
```

### Individual Workspace Tests
```bash
# Client tests only
cd client && bun run test

# Server tests only
cd server && bun run test

# Shared package tests only
cd shared && bun run test
```

### Test Modes
```bash
# Run tests in watch mode (development)
bun run test

# Run tests once (CI/build)
bun run test:run

# Run tests with coverage report
bun run test:coverage

# Run tests in CI mode
bun run test:ci
```

## 🧪 Writing Tests

### Client Component Tests
```typescript
// client/tests/components.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

const TestButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}>{children}</button>
)

describe('Component Tests', () => {
  it('renders correctly', () => {
    render(<TestButton onClick={() => {}}>Click me</TestButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<TestButton onClick={handleClick}>Click me</TestButton>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Client Utility Tests
```typescript
// client/tests/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from '../src/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('should handle conditional classes', () => {
      expect(cn('base-class', true && 'active', false && 'hidden')).toBe('base-class active')
    })

    it('should handle conflicting tailwind classes', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })
  })
})
```

### Client Hook Tests
```typescript
// client/tests/hooks.test.tsx
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useIsMobile } from '../src/hooks/use-mobile'

describe('useIsMobile Hook', () => {
  it('should return false on desktop', () => {
    window.innerWidth = 1024
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('should return true on mobile', () => {
    window.innerWidth = 500
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
```

### Server API Tests
```typescript
// server/tests/api.test.ts
import { describe, it, expect } from 'vitest'
import { createTestClient } from './setup'

describe('API Tests', () => {
  let client: any

  beforeEach(() => {
    client = createTestClient()
  })

  it('should get hello message', async () => {
    const response = await client.get('/')

    expect(response.status).toBe(200)
    expect(response.body).toBe('Hello Hono!')
  })

  it('should handle 404 routes', async () => {
    const response = await client.get('/api/non-existent')

    expect(response.status).toBe(404)
  })
})
```

### Server Middleware Tests
```typescript
// server/tests/middleware.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requireBearer } from '../src/middlewares/validations.middleware'

describe('Middleware Tests', () => {
  describe('requireBearer', () => {
    it('should pass with valid Bearer token', async () => {
      const mockNext = vi.fn()
      const mockContext = {
        req: { header: vi.fn(() => 'Bearer valid-token') }
      } as any

      await requireBearer()(mockContext, mockNext)
      expect(mockNext).toHaveBeenCalled()
    })

    it('should fail without authorization header', async () => {
      const mockNext = vi.fn()
      const mockContext = {
        req: { header: vi.fn(() => undefined) },
        json: vi.fn()
      } as any

      await requireBearer()(mockContext, mockNext)
      expect(mockNext).not.toHaveBeenCalled()
      expect(mockContext.json).toHaveBeenCalledWith(
        { success: false, message: 'Unauthorized' },
        401
      )
    })
  })
})
```

## 🔧 Test Configuration

### Client (React)
- **Environment**: jsdom for DOM testing
- **Framework**: Vitest + React Testing Library
- **Mocks**: fetch, ResizeObserver, IntersectionObserver, etc.
- **Test Libraries**: @testing-library/user-event, @testing-library/react-hooks

### Server (API)
- **Environment**: Node.js
- **Framework**: Vitest
- **Mocks**: PostgreSQL, Winston logger, shared utilities
- **Test client**: Simple fetch-based client for HTTP testing

## 📊 Coverage

```bash
# Generate coverage report
bun run test:coverage

# View HTML reports
open client/coverage/index.html
open server/coverage/index.html
```

Coverage goals:
- Focus on business logic and critical paths
- Don't worry about 100% coverage - focus on what matters
- Component testing for UI interactions
- API testing for server endpoints
- Utility and hook testing for core functionality

## 🛠️ Test Utilities

### Server Test Client
```typescript
import { createTestClient } from './setup'

const client = createTestClient()
const response = await client.get('/api/users')
```

### Environment-Based Testing
The test client automatically uses environment variables:
- `API_BASE_URL` - Server URL (defaults to http://localhost:3000)
- `NODE_ENV` - Set to 'test' automatically

```typescript
// Tests work with environment variables
const client = createTestClient()
// Uses process.env.API_BASE_URL or http://localhost:3000
```

## 🐛 Debugging Tests

### Vitest Debug
```bash
# Run in debug mode
bunx vitest --inspect

# Run with UI
bunx vitest --ui

# Run specific test
bunx vitest path/to/test.test.ts
```

## 📝 Best Practices

1. **Keep it simple** - Don't over-engineer tests
2. **Test what matters** - Focus on business logic
3. **Use descriptive names** - Test should explain what they test
4. **Mock external dependencies** - Don't rely on external services
5. **One assertion per test** - Keep tests focused
6. **Arrange, Act, Assert** - Structure tests clearly

## 🚨 Common Issues

### Client Tests
- Make sure to import from `@testing-library/react`
- Use `screen` queries instead of container queries
- Use `userEvent` for user interactions
- Mock window APIs properly (matchMedia, innerWidth, etc.)

### Server Tests
- Mock all external dependencies (database, logger, etc.)
- Use the provided `createTestClient` for HTTP testing
- Keep tests isolated and deterministic
- Mock shared utilities when testing middleware

## 🎯 Testing Best Practices for This Project

### 1. Follow Project Patterns
- **Use existing test setup** from `tests/setup.ts`
- **Follow naming conventions** (`*.test.ts` or `*.test.tsx`)
- **Test components in isolation** with proper mocking
- **Use TanStack Query testing utilities** for API testing

### 2. Focus on What Matters
- **Test business logic** not implementation details
- **Test user interactions** not component internals
- **Test error scenarios** not just happy paths
- **Test integration points** between client and server

### 3. Use the Right Testing Strategy
- **Unit Tests** - Pure functions, utilities, hooks
- **Component Tests** - React components with user interactions
- **Integration Tests** - API endpoints with database
- **E2E Tests** - Critical user workflows (optional)

## 🎯 Quick Start for Testing

1. **Run existing tests** to understand patterns:
   ```bash
   cd client && bun run test    # See frontend test patterns
   cd server && bun run test    # See backend test patterns
   ```

2. **Use the testing-specialist agent** for new features:
   - "I need tests for my new user management feature"
   - "Can you set up testing for my React component?"
   - "Help me test my API endpoints"

3. **Follow established patterns** in existing test files

4. **Focus on critical functionality** - don't test everything

## 📋 Testing Philosophy

### ✅ What We Test
- **Business logic** and user-facing functionality
- **API endpoints** and database operations
- **React components** with user interactions
- **Custom hooks** and utilities
- **Error handling** and edge cases

### ⚠️ What We Don't Test (by design)
- **Third-party libraries** - Assume they work
- **Type definitions** - Validated by TypeScript
- **Configuration files** - Not worth testing
- **Styling** - Visual testing is separate
- **Simple getters/setters** - Too trivial

### 🔧 Developer Responsibility
When adding features, ensure tests cover:
- **New API endpoints** with success/error cases
- **React components** with user interactions
- **Custom hooks** with different states
- **Complex business logic** with edge cases
- **Error handling** and validation

## 🤖 Getting Help with Testing

Use the **testing-specialist** agent for:
- Setting up test suites for new features
- Improving test coverage
- Creating testing strategies
- Reviewing existing tests

**Example usage:**
```
"I need comprehensive tests for my new user authentication system"
```

The agent will help you set up:
- Unit tests for authentication logic
- Integration tests for API endpoints
- Component tests for login forms
- Error handling and edge case testing

---

**Remember**: Good tests focus on behavior, not implementation. Use the testing-specialist agent to maintain consistency and quality across your test suite! 🚀