# Smart Starterkit

A production-ready TypeScript fullstack monorepo starterkit built with modern technologies. Clean, minimal, and ready for your features!

## 🚀 Project Status: 100% Production-Ready

This starterkit has been thoroughly tested and is **100% production-ready** with comprehensive features for modern fullstack development.

## ✨ Features

- 🚀 **Modern Tech Stack** - Bun runtime, React 19, Hono, PostgreSQL
- 📦 **Monorepo Architecture** - Client, Server, Shared workspaces
- 🎨 **Beautiful UI** - shadcn/ui components with Tailwind CSS
- 🗄️ **Database Ready** - PostgreSQL with Drizzle ORM and migrations
- 🧪 **Testing Infrastructure** - Vitest with React Testing Library
- 🔒 **Type Safety** - Full TypeScript strict mode coverage
- 🛠️ **Development Experience** - Hot reload, fast builds, great DX
- 📋 **Smart Agents** - Claude agents for consistent development
- 🎯 **Minimal Architecture** - Clean, maintainable code structure

## 🏗️ Architecture

```
smart-starterkit/
├── client/           # React 19 + Vite + TanStack Router
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui base components
│   │   │   ├── blocks/          # Reusable feature components
│   │   │   └── layout/          # Layout components
│   │   ├── routes/             # TanStack Router pages
│   │   ├── services/           # TanStack Query services
│   │   └── main.tsx
│   └── tests/               # Client tests
├── server/           # Hono API + PostgreSQL + Drizzle ORM
│   ├── src/
│   │   ├── routes/             # API route definitions ONLY
│   │   ├── controllers/        # Request handlers ONLY
│   │   ├── db/                # Database schema, migrations, seeders
│   │   ├── middlewares/       # Custom middleware
│   │   └── utils/             # Utility functions
│   └── tests/               # Server tests
├── shared/           # Shared TypeScript types and utilities
│   ├── src/
│   │   ├── types/             # TypeScript type definitions
│   │   ├── validation/        # Zod validation schemas
│   │   └── index.ts          # Shared exports
├── .claude/          # Claude agents and development rules
└── docs/             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Bun runtime** (recommended) or Node.js 18+
- **PostgreSQL 16+** with Docker support
- **Git** for version control

### 1. Environment Setup
```bash
# Copy environment template
cp server/.env.example server/.env.local
cp client/.env.example client/.env.local

# Configure DATABASE_URL in server/.env.local
DATABASE_URL=postgresql://app_user:app_password@localhost:5433/smart_starterkit
```

### 2. Database Setup
```bash
# Start PostgreSQL
docker run -d --name smart-starterkit-postgres \
  -e POSTGRES_DB=smart_starterkit \
  -e POSTGRES_USER=app_user \
  -e POSTGRES_PASSWORD=app_password \
  -p 5433:5432 \
  postgres:16

# Run database migrations
cd server
bun run db:migrate

# Seed database (optional)
bun run db:seed
```

### 3. Development
```bash
# Start all services
bun run dev

# Start individual services
bun run dev:client    # Frontend at http://localhost:5173
bun run dev:server    # Backend at http://localhost:3000
```

### 4. Build & Test
```bash
# Build all packages
bun run build

# Test all packages
bun run test
```

## 🔧 Development Commands

### Root Level Commands
```bash
# Start all services (client + server) in development mode
bun run dev

# Start individual services
bun run dev:client    # Frontend at http://localhost:5173
bun run dev:server    # Backend at http://localhost:3000

# Build and quality
bun run build         # Build all packages
bun run lint          # ESLint all packages
bun run type-check    # TypeScript validation
bun run test          # Run tests (if configured)
```

### Client-Specific Commands
```bash
cd client
bun run dev           # Vite dev server with hot reload
bun run build         # Production build (TypeScript + Vite)
bun run preview       # Preview production build locally
bun run lint          # ESLint
```

### Server-Specific Commands
```bash
cd server
bun run dev           # Bun watch mode with hot reload
bun run build         # TypeScript compilation

# Database operations
bun run db:migrate    # Run database migrations
bun run db:seed       # Run database seeders
```

## 📱 Access URLs

### Development
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Hono API)
- **API Documentation**: http://localhost:3000/api/docs (OpenAPI/Swagger)

## 🛠️ Tech Stack

### Frontend (client/)
- **React 19** with TypeScript - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Server state management and caching
- **shadcn/ui** - Modern component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework

### Backend (server/)
- **Hono** with OpenAPI - Fast web framework with auto-documentation
- **PostgreSQL 16+** - Robust relational database
- **Drizzle ORM** - Type-safe SQL with migrations and seeders
- **Zod** - Schema validation for TypeScript
- **Winston** - Structured logging for production

### Shared (shared/)
- **TypeScript** - Shared types and validation schemas
- **Zod Schemas** - Single source of truth for data validation

### Development Tools
- **Bun** - Fast runtime and package manager
- **Turbo** - Build orchestration and caching
- **ESLint** - Code quality and style rules
- **Vitest** - Modern testing framework
- **TypeScript** - Strict type checking

## 🎯 Key Architectural Patterns

### Minimal Backend Architecture
- **Route → Controller Pattern** - No service layer for simplicity
- **Direct Database Access** - Controllers use Drizzle ORM directly
- **Shared Validation** - Zod schemas used on both client and server

### Component Organization
- **ui/** - Base shadcn/ui components
- **blocks/** - Reusable feature combinations
- **layout/** - Application layout components
- **Services Minimalism** - Only when API calls needed

### Type Safety
- **Shared Types** - Single source of truth in `shared/src/types/`
- **Zod Validation** - Runtime validation matching TypeScript types
- **Strict Mode** - 100% TypeScript compliance

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete development guidelines and project structure
- **[Quick Start](docs/QUICK_START.md)** - Detailed setup instructions
- **[Testing Guide](docs/TESTING.md)** - Testing strategies and setup
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## 🤖 Claude Agents

This project includes specialized agents for consistent development:

- **fullstack-feature-architect** - Build complete features from database to UI
- **react-component-architect** - Create reusable components with shadcn/ui
- **testing-specialist** - Comprehensive testing strategies

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run specific workspace tests
cd client && bun run test    # Frontend tests
cd server && bun run test    # Backend tests
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ for modern fullstack development. Clean, minimal, and production-ready! 🚀