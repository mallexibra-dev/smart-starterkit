# Deployment Guide

Comprehensive deployment strategies for Smart Starterkit in production environments.

## Prerequisites

- **Docker & Docker Compose** (recommended)
- **Bun runtime** or Node.js 18+
- **PostgreSQL** database
- **Git** for version control

## 🚀 Production Deployment

### Option 1: Docker Deployment (Recommended)

#### Build and Deploy
```bash
# Clone repository
git clone <your-repository-url>
cd smart-starterkit

# Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env with production values:
DATABASE_URL=postgresql://user:password@your-db-host:5432/smart_starterkit
NODE_ENV=production
PORT=3000

# Build and deploy
docker-compose up -d
```

#### Docker Compose Production
```yaml
# docker-compose.yml (simplified)
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: smart_starterkit
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://app_user:app_password@postgres:5432/smart_starterkit
      NODE_ENV: production
    depends_on:
      - postgres
    ports:
      - "3000:3000"

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      VITE_API_BASE_URL: http://localhost:3000
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  postgres_data:
```

### Option 2: Manual Deployment

#### 1. Build Project
```bash
# Install dependencies
bun install

# Build all packages
bun run build
```

#### 2. Database Setup
```bash
# Setup PostgreSQL database
createdb smart_starterkit

# Run migrations
cd server
DATABASE_URL=postgresql://user:password@localhost:5432/smart_starterkit bun run db:migrate

# Seed production data (optional)
bun run db:seed
```

#### 3. Start Services
```bash
# Start server (production)
cd server
NODE_ENV=production DATABASE_URL=postgresql://... bun run build
bun run start

# Serve client files
cd client
# Use nginx, apache, or any static file server to serve dist/
```

## 🔧 Environment Configuration

### Production Environment Variables

**Server (.env):**
```bash
# Database
DATABASE_URL=postgresql://user:password@your-db-host:5432/smart_starterkit

# Server
NODE_ENV=production
PORT=3000

# Security
JWT_SECRET=your-super-secret-jwt-key-here
```

**Client (.env):**
```bash
# API
VITE_API_BASE_URL=https://your-api-domain.com
```

### Security Best Practices

1. **Use strong secrets:**
   ```bash
   # Generate secure JWT secret
   bun -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Database security:**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **Server security:**
   - Use HTTPS in production
   - Set up proper CORS
   - Implement rate limiting

## 📊 Monitoring and Logging

### Health Checks
```bash
# Check API health
curl https://your-api-domain.com/api/health

# Check database connection
# (Implement custom health check endpoint if needed)
```

### Logging
The project uses Winston for structured logging:
```bash
# View logs (Docker)
docker-compose logs -f server

# View logs (manual)
tail -f logs/app.log
```

## 🌐 Access URLs

### Production Environment
- **Frontend**: https://your-domain.com
- **Backend API**: https://your-api-domain.com
- **API Documentation**: https://your-api-domain.com/api/docs

### Development Environment
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs

## 🛠️ Useful Commands

### Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Restart services
docker-compose restart

# Scale services
docker-compose up -d --scale server=3
```

### Database Commands
```bash
# Access database
docker-compose exec postgres psql -U app_user smart_starterkit

# Backup database
docker-compose exec postgres pg_dump -U app_user smart_starterkit > backup.sql

# Restore database
docker-compose exec -T postgres psql -U app_user smart_starterkit < backup.sql
```

## 🔍 Troubleshooting

### Common Issues

**Database connection failed:**
```bash
# Check PostgreSQL container
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Test connection
docker-compose exec server bun run db:migrate
```

**Port conflicts:**
```bash
# Check used ports
lsof -i :3000
lsof -i :5173

# Kill processes
kill -9 <PID>
```

**Build failures:**
```bash
# Clear cache and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Performance Optimization

1. **Database optimization:**
   - Add proper indexes
   - Use connection pooling
   - Enable query caching

2. **Server optimization:**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement caching strategies

3. **Monitoring:**
   - Set up application monitoring
   - Monitor database performance
   - Track error rates and response times

## 🎯 Production Checklist

### Before Going Live

- [ ] **Environment configured** with production values
- [ ] **Database created** and migrations run
- [ ] **SSL certificates** installed
- [ ] **Domain names** configured
- [ ] **Backup strategy** implemented
- [ ] **Monitoring** set up
- [ ] **Error logging** configured
- [ ] **Security scan** performed

### Security Checklist

- [ ] **Strong passwords** for all services
- [ ] **JWT secrets** generated and secure
- [ ] **CORS configured** properly
- [ ] **Rate limiting** implemented
- [ ] **Input validation** enabled
- [ ] **SQL injection** protection verified
- [ ] **XSS protection** enabled
- [ ] **HTTPS enforced**

## 🚀 Next Steps

1. **Set up CI/CD** pipeline for automated deployments
2. **Configure monitoring** (Prometheus, Grafana, etc.)
3. **Set up alerting** for critical issues
4. **Implement backup strategies** for disaster recovery
5. **Consider CDN** for better performance
6. **Scale infrastructure** based on traffic needs

---

**Your Smart Starterkit is now ready for production!** 🚀

For additional help, refer to:
- [Quick Start Guide](QUICK_START.md) - Initial setup
- [Testing Guide](TESTING.md) - Testing strategies
- [CLAUDE.md](../CLAUDE.md) - Development guidelines