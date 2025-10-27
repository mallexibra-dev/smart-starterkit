# Quick Start Guide

Get your Smart Starterkit project running in minutes with this comprehensive guide.

## 🚀 Project Status: 100% Production-Ready

This starterkit has been thoroughly tested and is **100% production-ready** with comprehensive features for modern fullstack development.

## Prerequisites

- **Bun runtime** (recommended) or Node.js 18+
- **PostgreSQL 16+** with Docker support
- **Git** for version control

## 🚀 Quick Setup (5 Minutes)

The fastest way to get started:

```bash
# Clone the repository
git clone <your-repository-url>
cd smart-starterkit

# Install dependencies (uses Bun workspaces)
bun install
```

### 2. Environment Setup

```bash
# Copy environment templates
cp server/.env.example server/.env.local
cp client/.env.example client/.env.local

# Configure DATABASE_URL in server/.env.local
DATABASE_URL=postgresql://app_user:app_password@localhost:5433/smart_starterkit
```

### 3. Database Setup

**Start PostgreSQL with Docker:**
```bash
# Start PostgreSQL container
docker run -d --name smart-starterkit-postgres \
  -e POSTGRES_DB=smart_starterkit \
  -e POSTGRES_USER=app_user \
  -e POSTGRES_PASSWORD=app_password \
  -p 5433:5432 \
  postgres:16

# Run database migrations
cd server
bun run db:migrate

# Seed database with sample data (optional)
bun run db:seed
```

### 4. Start Development

```bash
# Start all services (client + server)
bun run dev

# Or start services individually
bun run dev:client    # Frontend at http://localhost:5173
bun run dev:server    # Backend at http://localhost:3000
```

That's it! Your Smart Starterkit is now running. 🎉

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

### Database Commands
```bash
cd server

# Database operations
bun run db:migrate    # Run database migrations
bun run db:seed       # Run database seeders
bun run db:studio     # Database GUI (Drizzle Studio)
```

### Client Commands
```bash
cd client

# Development
bun run dev           # Vite dev server with hot reload
bun run build         # Production build (TypeScript + Vite)
bun run preview       # Preview production build locally
bun run lint          # ESLint
```

## 🏗️ Project Structure

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

## 🔧 Configuration

### Environment Variables

**Server (server/.env.local)**
```bash
# Database
DATABASE_URL=postgresql://app_user:app_password@localhost:5433/smart_starterkit

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Client (client/.env.local)**
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

### Database Setup

The starterkit uses PostgreSQL with Drizzle ORM:

**Current Schema:**
- `users` - User management with authentication fields
- `categories` - Category management
- `items` - Item management with category relationships

**Database Operations:**
```bash
cd server

# Generate new migration
bun run db:generate

# Run migrations
bun run db:migrate

# Open database GUI
bun run db:studio

# Seed with sample data
bun run db:seed
```

## 📱 Access URLs

### Development
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Hono API)
- **API Documentation**: http://localhost:3000/api/docs (OpenAPI/Swagger)
- **Database GUI**: http://localhost:3000 (Drizzle Studio)

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

## 🎯 Next Steps

1. **Explore the Architecture** - Read [CLAUDE.md](../CLAUDE.md) for complete development guidelines
2. **Use Claude Agents** - Leverage specialized agents in `.claude/agents/` for consistent development
3. **Create Components** - Build reusable components in `client/src/components/blocks/`
4. **Add Features** - Use the fullstack-feature-architect agent for complete features
5. **Customize Design** - Modify shadcn/ui components and Tailwind styles

## 📚 Documentation

- **[CLAUDE.md](../CLAUDE.md)** - Complete development guidelines and project structure
- **[Testing Guide](TESTING.md)** - Testing strategies and setup
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment
- **[Claude Agents](../.claude/README.md)** - Specialized development agents

## 🆘 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check used ports
lsof -i :3000
lsof -i :5173

# Kill processes
kill -9 <PID>
```

**Database connection issues:**
```bash
# Check PostgreSQL container
docker ps | grep smart-starterkit-postgres

# Check database connection
cd server && bun run db:migrate
```

**Build issues:**
```bash
# Clear build cache
rm -rf node_modules/.cache
bun install
bun run build
```

### Getting Help

1. **Check the [documentation](../docs/)** - Comprehensive guides available
2. **Review [CLAUDE.md](../CLAUDE.md)** - Complete project understanding
3. **Use Claude Agents** - Specialized help for specific tasks

---

**Happy coding! 🎉 Your Smart Starterkit is ready for development!**