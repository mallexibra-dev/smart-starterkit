#!/bin/bash

# Smart Starterkit Deployment Script
# Usage: ./scripts/deploy.sh [environment] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
SKIP_BUILD=false
SKIP_MIGRATIONS=false
SKIP_BACKUP=false
VERBOSE=false

# Helper functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

show_help() {
    cat << EOF
Smart Starterkit Deployment Script

Usage: $0 [environment] [options]

Environments:
  dev, development     Development environment
  staging             Staging environment
  prod, production    Production environment

Options:
  --skip-build        Skip building Docker images
  --skip-migrations   Skip database migrations
  --skip-backup       Skip database backup (production only)
  --verbose           Enable verbose output
  --help              Show this help message

Examples:
  $0 dev                    Deploy to development
  $0 staging                Deploy to staging
  $0 prod                   Deploy to production
  $0 prod --skip-backup     Deploy to production without backup
  $0 dev --verbose          Deploy with verbose output

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        dev|development)
            ENVIRONMENT="development"
            shift
            ;;
        staging)
            ENVIRONMENT="staging"
            shift
            ;;
        prod|production)
            ENVIRONMENT="production"
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-migrations)
            SKIP_MIGRATIONS=true
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate environment
case $ENVIRONMENT in
    development|staging|production)
        ;;
    *)
        error "Invalid environment: $ENVIRONMENT"
        show_help
        exit 1
        ;;
esac

log "Starting deployment to $ENVIRONMENT environment..."

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi

    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        error "Please run this script from the project root directory"
        exit 1
    fi

    # Check environment file
    local env_file=".env"
    if [[ $ENVIRONMENT == "production" ]]; then
        env_file=".env.production"
    fi

    if [[ ! -f "$env_file" ]]; then
        error "Environment file $env_file not found"
        log "Please copy .env.example to $env_file and configure it"
        exit 1
    fi

    success "Prerequisites check passed"
}

# Backup database (production only)
backup_database() {
    if [[ $ENVIRONMENT == "production" && $SKIP_BACKUP == false ]]; then
        log "Creating database backup..."

        local backup_dir="backups"
        local backup_file="$backup_dir/backup_$(date +%Y%m%d_%H%M%S).sql"

        mkdir -p "$backup_dir"

        if docker-compose ps mysql | grep -q "Up"; then
            docker-compose exec -T mysql mysqldump \
                -u root \
                -p"$MYSQL_ROOT_PASSWORD" \
                --single-transaction \
                --routines \
                --triggers \
                smart_starterkit > "$backup_file"

            success "Database backed up to $backup_file"

            # Keep only last 10 backups
            ls -t "$backup_dir"/backup_*.sql | tail -n +11 | xargs -r rm
        else
            warning "MySQL container is not running, skipping backup"
        fi
    fi
}

# Build Docker images
build_images() {
    if [[ $SKIP_BUILD == false ]]; then
        log "Building Docker images..."

        if [[ $VERBOSE == true ]]; then
            docker-compose build --no-cache
        else
            docker-compose build --quiet
        fi

        success "Docker images built successfully"
    else
        log "Skipping Docker build"
    fi
}

# Deploy services
deploy_services() {
    log "Deploying services..."

    # Choose appropriate compose file
    local compose_file="docker-compose.yml"
    if [[ $ENVIRONMENT == "development" ]]; then
        compose_file="docker-compose.dev.yml"
    fi

    # Stop existing services
    if docker-compose -f "$compose_file" ps | grep -q "Up"; then
        log "Stopping existing services..."
        docker-compose -f "$compose_file" down
    fi

    # Start services
    log "Starting services..."
    if [[ $VERBOSE == true ]]; then
        docker-compose -f "$compose_file" up -d
    else
        docker-compose -f "$compose_file" up -d --quiet-pull
    fi

    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 10

    # Check service health
    check_service_health

    success "Services deployed successfully"
}

# Check service health
check_service_health() {
    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost:3000/api/health &>/dev/null; then
            success "Server is healthy"
            return 0
        fi

        if [[ $VERBOSE == true ]]; then
            log "Health check attempt $attempt/$max_attempts..."
        fi

        sleep 2
        ((attempt++))
    done

    error "Server health check failed after $max_attempts attempts"
    return 1
}

# Run database migrations
run_migrations() {
    if [[ $SKIP_MIGRATIONS == false ]]; then
        log "Running database migrations..."

        # Check if migrations table exists and run new migrations
        if docker-compose ps mysql | grep -q "Up"; then
            # For now, just check if database is accessible
            docker-compose exec -T mysql mysql \
                -u root \
                -p"$MYSQL_ROOT_PASSWORD" \
                -e "SELECT 1" smart_starterkit >/dev/null 2>&1

            if [[ $? -eq 0 ]]; then
                success "Database is ready"
            else
                error "Database connection failed"
                exit 1
            fi
        else
            error "MySQL container is not running"
            exit 1
        fi
    else
        log "Skipping database migrations"
    fi
}

# Show deployment summary
show_summary() {
    log "Deployment Summary"
    echo "=================="
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo ""

    echo "Services:"
    docker-compose ps
    echo ""

    echo "Access URLs:"
    if [[ $ENVIRONMENT == "development" ]]; then
        echo "Frontend: http://localhost:5174"
        echo "Backend:  http://localhost:3001"
    else
        echo "Frontend: http://localhost"
        echo "Backend:  http://localhost:3000"
    fi
    echo ""

    echo "Useful commands:"
    echo "View logs:     docker-compose logs -f"
    echo "Stop services: docker-compose down"
    echo "Restart:       docker-compose restart"
}

# Main deployment flow
main() {
    log "🚀 Starting Smart Starterkit deployment..."

    check_prerequisites

    if [[ $ENVIRONMENT == "production" ]]; then
        backup_database
    fi

    build_images
    deploy_services
    run_migrations
    show_summary

    success "🎉 Deployment completed successfully!"
}

# Handle script interruption
trap 'error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"