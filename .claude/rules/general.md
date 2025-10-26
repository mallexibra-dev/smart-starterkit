# General Development Rules

## 🎯 Project Philosophy

### Core Principles
- **Clean Architecture**: Minimal, organized structure
- **Developer Experience**: Easy to understand and extend
- **Production Ready**: Robust error handling and type safety
- **Scalable**: Patterns that support growth without complexity

### Development Mindset
- **Pragmatic over perfect** - ship working code
- **Consistency over cleverness** - maintain patterns
- **Simplicity over complexity** - avoid over-engineering
- **Quality over quantity** - write maintainable code

## 📁 Monorepo Structure

### Workspace Organization
```
smart-starterkit/
├── client/           # React frontend
├── server/           # Hono backend
├── shared/           # Shared types and utilities
├── .claude/          # Claude rules and prompts
└── docs/             # Documentation
```

### Workspace Rules
- **Client**: React 19 + Vite + TanStack Router
- **Server**: Hono + PostgreSQL + Drizzle ORM
- **Shared**: Types, validation, utilities only
- **NO cross-pollution** between workspaces

## 🔧 Development Environment

### Required Tools
- **Bun runtime** (recommended) or Node.js 18+
- **PostgreSQL 16+** with Docker support
- **TypeScript** strict mode enabled
- **ESLint** for code quality
- **Git** for version control

### Development Commands
```bash
# Start all services
bun run dev

# Start individual services
bun run dev:client    # Frontend at http://localhost:5173
bun run dev:server    # Backend at http://localhost:3000

# Database operations
bun run db:migrate    # Run migrations
bun run db:seed       # Seed database

# Build and quality
bun run build         # Build all packages
bun run lint          # ESLint check
bun run type-check    # TypeScript validation
```

## 📝 File Naming Conventions

### Universal Rules
- **kebab-case** for file names (e.g., `user-service.ts`)
- **PascalCase** for class/component exports (e.g., `UserService`)
- **camelCase** for variables and functions
- **SCREAMING_SNAKE_CASE** for constants
- **descriptive names** that explain purpose

### File Extension Standards
- **.ts** for TypeScript files
- **.tsx** for React components
- **.json** for configuration files
- **.md** for documentation
- **.env.example** for environment templates

## 🚀 Git Workflow

### Branch Strategy
- **main/master**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature branches
- **hotfix/***: Critical fixes for production

### Commit Standards
- **Conventional Commits** format
- **Descriptive messages** explaining what and why
- **Imperative mood** (e.g., "Add user validation")
- **Linked to issues** when applicable

### Commit Examples
```bash
feat: add user authentication system
fix: resolve database connection timeout
docs: update API documentation
refactor: simplify user service logic
test: add unit tests for validation utilities
```

## 🔍 Code Quality Standards

### TypeScript Rules
- **Strict mode** always enabled
- **No implicit any** unless absolutely necessary
- **Proper typing** for all functions and variables
- **Interface over type** for object shapes
- **Generic types** with meaningful constraints

### Error Handling
- **Try-catch blocks** for async operations
- **Meaningful error messages** for debugging
- **Graceful degradation** when possible
- **Logging for critical** operations
- **User-friendly errors** for UI display

### Performance Considerations
- **Lazy loading** for large components
- **Memoization** for expensive computations
- **Efficient database** queries
- **Bundle size** optimization
- **Caching strategies** where appropriate

## 🛑 Security Guidelines

### General Security
- **Input validation** on all user inputs
- **SQL injection prevention** with parameterized queries
- **XSS prevention** with proper sanitization
- **HTTPS in production** environments
- **Environment variables** for sensitive data

### Authentication & Authorization
- **Strong password policies**
- **JWT tokens** with proper expiration
- **Role-based access control**
- **Session management** best practices
- **Rate limiting** for API endpoints

## 📊 Documentation Standards

### Code Documentation
- **JSDoc comments** for complex functions
- **Type documentation** for interfaces
- **README files** for major features
- **Inline comments** for non-obvious logic
- **Example usage** for utilities

### API Documentation
- **OpenAPI/Swagger** for backend APIs
- **Type documentation** for shared types
- **Usage examples** for complex workflows
- **Error response** documentation
- **Authentication** requirements

## 🧪 Testing Philosophy

### Testing Approach
- **Unit tests** for utilities and pure functions
- **Integration tests** for API endpoints
- **Component tests** for React components
- **E2E tests** for critical user flows
- **Performance tests** for bottlenecks

### Test Organization
```
src/
├── __tests__/         # Test files
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── e2e/          # End-to-end tests
└── fixtures/         # Test data
```

## 🔧 Tooling Configuration

### Essential Configurations
- **TypeScript**: Strict mode configuration
- **ESLint**: Code quality and style rules
- **Prettier**: Code formatting standards
- **Husky**: Git hooks for quality checks
- **VS Code**: Recommended extensions and settings

### Development Tools
- **Turbo**: Build orchestration and caching
- **Vite**: Fast development server
- **Drizzle**: Database toolkit and ORM
- **shadcn/ui**: Component library framework
- **TanStack**: Query and routing libraries

## 📋 Quality Checklist

### Before Committing Code
- [ ] Code follows established patterns
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes without errors
- [ ] Tests pass (if applicable)
- [ ] Documentation is updated
- [ ] No console.log statements left
- [ ] Environment variables documented
- [ ] Security considerations addressed

### Before Merging to Main
- [ ] All tests passing in CI/CD
- [ ] Performance impact assessed
- [ ] Breaking changes documented
- [ ] Migration guides provided
- [ ] Rollback plan considered
- [ ] Monitoring and logging added
- [ ] Code review completed

## 🚀 Development Workflow

### Feature Development Process
1. **Create feature branch** from develop
2. **Set up development** environment
3. **Implement backend** (if needed)
4. **Implement frontend** (if needed)
5. **Update shared types** (if needed)
6. **Write tests** for new functionality
7. **Update documentation**
8. **Submit pull request** for review
9. **Address feedback** and iterate
10. **Merge to develop** after approval

### Bug Fix Process
1. **Reproduce issue** consistently
2. **Identify root cause**
3. **Write failing test** (if possible)
4. **Implement fix**
5. **Verify fix works**
6. **Update documentation** (if needed)
7. **Test regression** scenarios
8. **Deploy fix** to appropriate environment

## 🎯 Success Metrics

### Code Quality Indicators
- **TypeScript coverage**: 100% typed code
- **Test coverage**: Meaningful tests for critical paths
- **Bundle size**: Optimized and minimal
- **Performance**: Fast load times and responses
- **Security**: No known vulnerabilities

### Developer Experience Indicators
- **Easy onboarding**: New developers can start quickly
- **Clear patterns**: Consistent code organization
- **Good documentation**: Self-explanatory codebase
- **Fast builds**: Efficient development workflow
- **Helpful errors**: Clear debugging information

**Follow these general rules to maintain project quality and consistency!** 🚀