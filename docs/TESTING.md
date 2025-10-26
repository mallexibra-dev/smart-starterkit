# Testing Guide

Simple and efficient testing setup for the Smart Starterkit project.

## 🏗️ Testing Structure

```
smart-starterkit/
├── client/
│   └── tests/
│       ├── components.test.tsx    # React component tests
│       ├── utils.test.ts          # Utility function tests
│       ├── hooks.test.tsx         # Custom hook tests
│       ├── services.test.ts       # API service tests (optional)
│       └── setup.ts              # Client test setup and mocks
│   └── vitest.config.ts          # Client test configuration
├── server/
│   └── tests/
│       ├── api.test.ts           # API endpoint tests
│       ├── middleware.test.ts    # Middleware tests
│       └── setup.ts              # Server test setup and mocks
│   └── vitest.config.ts          # Server test configuration
└── docs/TESTING.md               # This documentation
```

## 🚀 Running Tests

### From Root Directory
```bash
# Run all tests (client + server)
bun run test

# Run only client tests
bun run test:client

# Run only server tests
bun run test:server

# Run tests with coverage
bun run test:coverage

# Run all tests for CI
bun run test:ci
```

### Client Tests
```bash
cd client

# Run tests in watch mode
bun run test

# Run tests once
bun run test:run

# Run with coverage
bun run test:coverage
```

### Server Tests
```bash
cd server

# Run tests in watch mode
bun run test

# Run tests once
bun run test:run

# Run with coverage
bun run test:coverage
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
- **Mocks**: MySQL, Winston logger, shared utilities
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

## 🎯 Quick Start

1. **Run existing tests** to see how they work:
   ```bash
   bun run test:client
   bun run test:server
   ```

2. **Add new test files** in the appropriate directories:
   - `client/tests/` for React components, utilities, hooks, and services
   - `server/tests/` for API endpoints, middleware, and server utilities

3. **Follow the patterns** shown in example test files

4. **Keep it simple** - Focus on testing what matters

## 📋 What's Tested (and What's Not)

### ✅ Currently Tested:
- Client utilities (cn function)
- Client hooks (useIsMobile)
- Server middleware (validation, auth)
- Basic API functionality
- Component examples

### ⚠️ Not Tested (by design):
- **Shared utilities** - Pure functions, tested in consuming workspaces
- **Third-party libraries** - Assume they work correctly
- **Configuration files** - Not worth testing
- **Type definitions** - Validated by TypeScript

### 🔧 Developer Responsibility:
When adding new features, add tests for:
- New utility functions
- Custom hooks
- API endpoints
- Middleware
- Complex business logic

## 📋 Optional: E2E Testing

For full-stack applications, you might want to add E2E testing later. Popular options:
- **Playwright** - Modern, fast, multi-browser support
- **Cypress** - Developer-friendly, great dashboard
- **TestCafe** - Simple setup, good for beginners

But for most starterkit use cases, unit + integration tests are sufficient! 🚀

That's it! Minimal but complete testing setup focused on what matters.