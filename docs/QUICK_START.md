# Quick Start Guide

Get your Smart Starterkit project running in minutes with this comprehensive guide.

## Prerequisites

- **Node.js** 18+ and **Bun** (recommended) or npm
- **Docker** and **Docker Compose** (for containerized deployment)
- **Git** for version control

## 🚀 One-Command Setup

The fastest way to get started:

```bash
git clone https://github.com/your-username/smart-starterkit.git
cd smart-starterkit
./scripts/setup.sh
```

This will:
✅ Install all dependencies
✅ Set up environment files
✅ Initialize database
✅ Build the project
✅ Run initial tests

## 🛠️ Manual Setup

If you prefer manual setup:

### 1. Clone & Install

```bash
git clone https://github.com/your-username/smart-starterkit.git
cd smart-starterkit

# Install dependencies
bun install  # or npm install
```

### 2. Environment Setup

```bash
# Copy environment templates
cp .env.example .env
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# Edit environment files with your configuration
# Generate JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Setup

**Option A: Docker (Recommended)**
```bash
# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=smart_starterkit \
  -e POSTGRES_USER=app_user \
  -e POSTGRES_PASSWORD=app_password \
  -p 5432:5432 \
  postgres:16

# Run migrations
cd server
bun run db:migrate
```

**Option B: Local PostgreSQL**
```bash
# Create database and user in your local PostgreSQL
createdb smart_starterkit
createuser app_user
psql -c "ALTER USER app_user PASSWORD 'app_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE smart_starterkit TO app_user;"

# Run migrations
cd server
bun run db:migrate
```

### 4. Run Development Server

```bash
bun run dev  # Starts both client and server
```

Or separately:
```bash
bun run dev:server  # Backend at http://localhost:3000
bun run dev:client  # Frontend at http://localhost:5173
```

## 🐳 Docker Development

### Development Environment

```bash
# Start all services with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

```bash
# Deploy production
docker-compose up -d

# Scale services
docker-compose up -d --scale server=2
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development servers |
| `bun run build` | Build all packages |
| `bun run test` | Run all tests |
| `bun run lint` | Lint all packages |
| `bun run type-check` | Type checking |

### Docker Commands

| Command | Description |
|---------|-------------|
| `bun run docker:dev` | Start development containers |
| `bun run docker:prod` | Start production containers |
| `bun run docker:staging` | Start staging containers |
| `bun run docker:logs` | View container logs |

### Deployment Commands

| Command | Description |
|---------|-------------|
| `bun run deploy:dev` | Deploy to development |
| `bun run deploy:staging` | Deploy to staging |
| `bun run deploy:prod` | Deploy to production |

## 🏗️ Project Structure

```
smart-starterkit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── routes/         # Page routes
│   │   ├── services/       # API services
│   │   └── main.tsx        # App entry point
│   └── tests/              # Frontend tests
├── server/                 # Hono backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── schemas/        # Validation schemas
│   ├── database/           # Database files
│   └── tests/              # Backend tests
├── shared/                 # Shared types and utils
├── scripts/                # Deployment scripts
├── docs/                   # Documentation
└── docker-compose*.yml     # Docker configurations
```

## 🔧 Configuration

### Environment Variables

**Root (.env)**
- Database connection
- JWT secrets
- Server configuration

**Client (client/.env.local)**
- API endpoints
- Feature toggles
- External service keys

### Database

The starterkit uses PostgreSQL with Drizzle ORM and the following schema:
- `users` - User management and authentication
- `categories` - Categories for items
- `items` - Items with categories and pricing
- Additional tables can be added as needed

### Authentication

JWT-based authentication is included:
- Login/Register endpoints
- Protected routes
- User context management
- Token refresh mechanism

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

## 🚀 Deployment

### Quick Deploy

```bash
# Development
bun run deploy:dev

# Staging
bun run deploy:staging

# Production
bun run deploy:prod
```

### Manual Deploy

1. **Setup production server**
2. **Configure environment variables**
3. **Use Docker Compose**
4. **Set up SSL certificate**

See [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

## 🎯 Next Steps

1. **Customize the UI** - Modify components in `client/src/components/`
2. **Add API endpoints** - Create routes in `server/src/routes/`
3. **Set up authentication** - Configure JWT and user management
4. **Add your features** - Build your application logic
5. **Deploy** - Use the provided deployment scripts

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [CLAUDE.md](../CLAUDE.md) - Development guidelines
- [API Documentation](http://localhost:3000/api/docs) - Interactive API docs

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

**Database connection:**
```bash
# Check PostgreSQL container
docker ps | grep postgres

# Check logs
docker logs postgres
```

**Permission issues:**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Getting Help

1. Check the [documentation](../docs/)
2. Review [GitHub issues](https://github.com/your-username/smart-starterkit/issues)
3. Create a new issue with details

---

**Happy coding! 🎉**