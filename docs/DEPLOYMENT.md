# Simple Deployment Guide

Quick deployment guide for Smart Starterkit.

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Deploy

### Using Docker (Recommended)

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d
```

### Manual Deploy

```bash
# Install dependencies
bun install

# Build project
bun run build

# Start server
bun run dev:server
```

## Environment Setup

Copy and configure environment files:

```bash
# Development
cp .env.example .env

# Production
cp .env.production.example .env
```

Key environment variables:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Database connection
- `JWT_SECRET` - Authentication secret
- `NODE_ENV` - Environment (development/production)

## Docker Compose Files

- `docker-compose.yml` - Production deployment
- `docker-compose.dev.yml` - Development with hot reload
- `docker-compose.staging.yml` - Staging environment

## Access URLs

### Development
- Frontend: http://localhost:5174
- Backend: http://localhost:3001
- Database: localhost:3307

### Production
- Frontend: http://localhost
- Backend: http://localhost:3000
- Database: localhost:3306

### Staging
- Frontend: http://localhost:81
- Backend: http://localhost:3002
- Database: localhost:3308

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Restart services
docker-compose restart
```

## Health Check

Check if services are running:
```bash
curl http://localhost:3000/api/health
```

## Production Tips

1. Change default passwords in docker-compose files
2. Use strong JWT secrets
3. Configure proper domain names
4. Set up SSL certificates
5. Regular database backups

## Troubleshooting

**Database connection failed:**
```bash
# Check MySQL container
docker-compose ps mysql

# Check logs
docker-compose logs mysql
```

**Port conflicts:**
```bash
# Check used ports
lsof -i :3000
lsof -i :5173
```

That's it! Keep it simple.