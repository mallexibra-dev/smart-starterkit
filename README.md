# Smart Starterkit

A modern TypeScript fullstack monorepo starterkit built with Bun, Hono, React, and MySQL.

## ✨ Features

- 🚀 **Modern Tech Stack** - Bun, Hono, React 19, Vite, TypeScript
- 📱 **Monorepo Architecture** - Client, Server, Shared packages
- 🎨 **Beautiful UI** - shadcn/ui components with Tailwind CSS
- 🔐 **Authentication** - JWT-based auth with proper validation
- 🧪 **Testing Ready** - Vitest with React Testing Library
- 🐳 **Docker Support** - Multi-environment deployment
- 🛡️ **Error Boundaries** - Production-ready error handling
- 📦 **Type Safety** - Full TypeScript coverage

## 🏗️ Architecture

```
smart-starterkit/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── routes/         # Page routes
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
├── server/          # Hono backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── schemas/        # Validation schemas
├── shared/          # Shared types & utils
└── scripts/         # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- Docker & Docker Compose
- MySQL

### Installation

```bash
git clone https://github.com/your-username/smart-starterkit.git
cd smart-starterkit

# Setup environment
cp .env.example .env
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# Install dependencies
bun install

# Start development
bun run dev
```

### Docker Development (Recommended)

```bash
# Development environment
docker-compose -f docker-compose.dev.yml up -d

# Production deployment
docker-compose up -d
```

## 📚 Available Scripts

```bash
# Development
bun run dev              # Start all services
bun run dev:client        # Frontend only
bun run dev:server        # Backend only

# Build & Test
bun run build            # Build all packages
bun run test             # Run tests
bun run lint             # Lint code

# Deployment
bun run deploy:dev       # Deploy to development
bun run deploy:staging    # Deploy to staging
bun run deploy:prod       # Deploy to production
```

## 🔧 Environment Configuration

Key environment variables:

- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Database connection
- `JWT_SECRET` - Authentication secret
- `NODE_ENV` - Environment (development/production)

## 📱 Access URLs

### Development
- Frontend: http://localhost:5174
- Backend: http://localhost:3001

### Production
- Frontend: http://localhost
- Backend: http://localhost:3000

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **shadcn/ui** - Component library
- **Tailwind CSS** - CSS framework

### Backend
- **Hono** - Web framework
- **MySQL** - Database
- **Zod** - Schema validation
- **JWT** - Authentication
- **Winston** - Logging

### Development
- **TypeScript** - Type safety
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbo** - Build orchestration

## 📖 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Quick Start](docs/QUICK_START.md) - Get started quickly
- [Project Guide](CLAUDE.md) - Development guidelines

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run with coverage
bun run test:coverage

# Run specific package tests
bun run test:client
bun run test:server
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 🆘 Support

If you have any questions or need help, please:
- Check the [documentation](docs/)
- Open an [issue](https://github.com/your-username/smart-starterkit/issues)
- Join our [discussions](https://github.com/your-username/smart-starterkit/discussions)

---

Made with ❤️ for the developer community