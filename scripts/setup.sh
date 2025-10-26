#!/bin/bash

# Smart Starterkit Setup Script
# Usage: ./scripts/setup.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SKIP_ENV_SETUP=false
SKIP_DEPS_INSTALL=false
SKIP_DB_INIT=false
ENVIRONMENT="development"

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
Smart Starterkit Setup Script

Usage: $0 [options]

Options:
  --skip-env         Skip environment setup
  --skip-deps        Skip dependency installation
  --skip-db          Skip database initialization
  --env ENV          Set environment (development|staging|production)
  --help             Show this help message

Examples:
  $0                      Full setup for development
  $0 --env staging        Setup for staging environment
  $0 --skip-deps          Setup without installing dependencies

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-env)
            SKIP_ENV_SETUP=true
            shift
            ;;
        --skip-deps)
            SKIP_DEPS_INSTALL=true
            shift
            ;;
        --skip-db)
            SKIP_DB_INIT=true
            shift
            ;;
        --env)
            ENVIRONMENT="$2"
            shift 2
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

# Check if running in project root
check_project_root() {
    if [[ ! -f "package.json" ]] || [[ ! -d "client" ]] || [[ ! -d "server" ]]; then
        error "Please run this script from the project root directory"
        exit 1
    fi
    success "Project root validated"
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi

    local node_version=$(node -v | cut -d'v' -f2)
    if [[ $(echo "$node_version" | cut -d'.' -f1) -lt 18 ]]; then
        error "Node.js version 18+ is required. Current version: $node_version"
        exit 1
    fi

    # Check Bun (optional but recommended)
    if ! command -v bun &> /dev/null; then
        warning "Bun is not installed. Using npm instead (bun is recommended for better performance)"
    fi

    # Check Git
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
        exit 1
    fi

    success "System requirements check passed"
}

# Setup environment files
setup_environment() {
    if [[ $SKIP_ENV_SETUP == true ]]; then
        log "Skipping environment setup"
        return
    fi

    log "Setting up environment files..."

    # Root environment
    if [[ ! -f ".env" ]]; then
        if [[ $ENVIRONMENT == "production" ]]; then
            cp .env.production.example .env
        else
            cp .env.example .env
        fi
        success "Created .env file"
    else
        warning ".env file already exists, skipping"
    fi

    # Client environment
    if [[ ! -f "client/.env.local" ]]; then
        cp client/.env.example client/.env.local
        success "Created client/.env.local file"
    else
        warning "client/.env.local already exists, skipping"
    fi

    # Server environment
    if [[ ! -f "server/.env" ]]; then
        if [[ $ENVIRONMENT == "production" ]]; then
            cp .env.production.example server/.env
        else
            cp .env.example server/.env
        fi
        success "Created server/.env file"
    else
        warning "server/.env already exists, skipping"
    fi

    log "Please update the environment files with your configuration"
}

# Install dependencies
install_dependencies() {
    if [[ $SKIP_DEPS_INSTALL == true ]]; then
        log "Skipping dependency installation"
        return
    fi

    log "Installing dependencies..."

    # Check if Bun is available
    if command -v bun &> /dev/null; then
        log "Using Bun package manager..."
        bun install
    else
        log "Using npm package manager..."
        npm install
    fi

    success "Dependencies installed successfully"
}

# Setup database
setup_database() {
    if [[ $SKIP_DB_INIT == true ]]; then
        log "Skipping database setup"
        return
    fi

    log "Setting up database..."

    # Check if Docker is available
    if command -v docker &> /dev/null; then
        if docker info &> /dev/null; then
            log "Starting MySQL container for database setup..."

            # Start MySQL container
            docker run -d \
                --name smart-starterkit-mysql-setup \
                -e MYSQL_ROOT_PASSWORD=rootpassword \
                -e MYSQL_DATABASE=smart_starterkit \
                -e MYSQL_USER=app_user \
                -e MYSQL_PASSWORD=app_password \
                -p 3306:3306 \
                mysql:8.0

            # Wait for MySQL to be ready
            log "Waiting for MySQL to be ready..."
            for i in {1..30}; do
                if docker exec smart-starterkit-mysql-setup mysqladmin ping -h localhost --silent; then
                    break
                fi
                sleep 2
            done

            # Initialize database schema
            if [[ -f "server/database/query.sql" ]]; then
                log "Initializing database schema..."
                docker exec -i smart-starterkit-mysql-setup mysql \
                    -u root \
                    -prootpassword \
                    smart_starterkit < server/database/query.sql
                success "Database schema initialized"
            fi

            # Stop setup container
            docker stop smart-starterkit-mysql-setup
            docker rm smart-starterkit-mysql-setup

            success "Database setup completed"
        else
            warning "Docker is not running. Please start Docker and run the script again"
        fi
    else
        warning "Docker is not installed. Please set up the database manually"
    fi
}

# Build project
build_project() {
    log "Building project..."

    # Build all packages
    if command -v bun &> /dev/null; then
        bun run build
    else
        npm run build
    fi

    success "Project built successfully"
}

# Run initial tests
run_tests() {
    log "Running initial tests..."

    # Check if tests exist
    if [[ -f "package.json" ]] && grep -q "test" package.json; then
        if command -v bun &> /dev/null; then
            bun run test
        else
            npm run test
        fi
        success "Tests passed"
    else
        warning "No tests found, skipping"
    fi
}

# Create git hooks
setup_git_hooks() {
    log "Setting up git hooks..."

    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for Smart Starterkit

echo "Running pre-commit checks..."

# Run linting
if command -v bun &> /dev/null; then
    bun run lint || echo "⚠️  Linting failed, please fix before committing"
else
    npm run lint || echo "⚠️  Linting failed, please fix before committing"
fi

# Run type checking
if command -v bun &> /dev/null; then
    bun run type-check || echo "⚠️  Type check failed, please fix before committing"
else
    npm run type-check || echo "⚠️  Type check failed, please fix before committing"
fi

echo "Pre-commit checks completed"
EOF

    chmod +x .git/hooks/pre-commit
    success "Git hooks setup completed"
}

# Show next steps
show_next_steps() {
    log "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Update environment files with your configuration"
    echo "2. Review the documentation in docs/ folder"
    echo "3. Start development with: bun run dev"
    echo "4. Or deploy with: ./scripts/deploy.sh dev"
    echo ""
    echo "Useful commands:"
    echo "- Development:     bun run dev"
    echo "- Build:          bun run build"
    echo "- Test:           bun run test"
    echo "- Lint:           bun run lint"
    echo "- Deploy dev:     ./scripts/deploy.sh dev"
    echo "- Deploy prod:    ./scripts/deploy.sh prod"
    echo ""
    echo "Documentation:"
    echo "- Deployment:     docs/DEPLOYMENT.md"
    echo "- README:         README.md"
    echo "- CLAUDE.md:      CLAUDE.md"
}

# Main setup flow
main() {
    log "🚀 Starting Smart Starterkit setup..."

    check_project_root
    check_requirements
    setup_environment
    install_dependencies
    setup_database
    build_project
    run_tests
    setup_git_hooks
    show_next_steps

    success "🎉 Smart Starterkit setup completed!"
}

# Handle script interruption
trap 'error "Setup interrupted"; exit 1' INT TERM

# Run main function
main "$@"