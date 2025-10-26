# Contributing to Smart Starterkit

Thank you for your interest in contributing to Smart Starterkit! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- Docker & Docker Compose
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/your-username/smart-starterkit.git
   cd smart-starterkit
   ```

2. **Setup your development environment**
   ```bash
   # Install dependencies
   bun install

   # Setup environment
   cp .env.example .env
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env

   # Start development servers
   bun run dev
   ```

3. **Run tests**
   ```bash
   bun run test
   bun run lint
   bun run type-check
   ```

## 🏗️ Project Structure

```
smart-starterkit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── routes/         # Page routes
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
├── server/                 # Hono backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── schemas/        # Validation schemas
├── shared/                 # Shared types & utilities
│   └── src/
│       ├── types/         # TypeScript types
│       ├── validation/    # Zod schemas
│       └── utils/         # Utility functions
└── scripts/               # Deployment scripts
```

## 📝 Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules
- Use **Prettier** for code formatting
- Use **descriptive variable and function names**

### Component Guidelines

#### Frontend Components

```tsx
// Good: Descriptive component name
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  );
}
```

#### Backend Services

```typescript
// Good: Clear service function with proper typing
export class UserService {
  async getUserById(id: number): Promise<User | null> {
    const user = await db.query.users.findFirst({
      where: { id },
    });
    return user || null;
  }
}
```

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `camelCase.ts` (e.g., `useAuth.ts`)
- **Types**: `camelCase.type.ts` (e.g., `user.type.ts`)
- **Services**: `camelCase.service.ts` (e.g., `auth.service.ts`)
- **Schemas**: `camelCase.schema.ts` (e.g., `auth.schema.ts`)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run specific package tests
bun run test:client
bun run test:server
```

### Writing Tests

```tsx
// Example component test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🐳 Docker Guidelines

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build client
docker-compose build server
```

## 📝 Commit Guidelines

### Commit Messages

Use clear and descriptive commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): Add JWT authentication system
fix(server): Resolve database connection issue
docs(readme): Update installation instructions
```

### Branch Naming

- `feature/your-feature-name` - New features
- `fix/your-bug-fix` - Bug fixes
- `docs/your-doc-update` - Documentation updates

## 🐛 Bug Reports

### Before Creating an Issue

1. **Check existing issues** - Search for duplicates
2. **Test with latest code** - Ensure issue still exists
3. **Use template** - Provide structured information

### Creating an Issue

1. Use descriptive title
2. Provide detailed description
3. Include reproduction steps
4. Add environment details
5. Attach relevant logs/screenshots

## 🎯 Pull Requests

### Before Submitting

1. **Test your changes** - Run tests locally
2. **Update documentation** - If needed
3. **Follow code style** - Run linting
4. **Small, focused commits** - Keep changes atomic

### Submitting PR

1. **Clear description** - Explain what and why
2. **Link issues** - Reference related issues
3. **Include screenshots** - For UI changes
4. **Respond to reviews** - Address feedback promptly

## 📦 Publishing

### Version Bumping

We follow [Semantic Versioning](https://semver.org/):
- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features (backward compatible)
- **Patch** (0.0.x): Bug fixes (backward compatible)

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Deploy to production

## 📚 Documentation

### Updating Docs

- Keep documentation up-to-date with code changes
- Use clear examples
- Include screenshots where helpful
- Update relevant README sections

### Documentation Files

- `README.md` - Project overview and setup
- `docs/` - Detailed guides
- `CLAUDE.md` - Development guidelines

## 🚀 Release Process

1. **Prepare Changes**
   - Ensure all tests pass
   - Update documentation
   - Update version numbers

2. **Create Release**
   - Create GitHub release
   - Generate changelog
   - Tag release version

3. **Deploy**
   - Deploy to staging
   - Test thoroughly
   - Deploy to production

## 🤝 Community

### Code of Conduct

- Be respectful and inclusive
- Welcome new contributors
- Provide constructive feedback
- Focus on what's best for the community

### Getting Help

- Check existing documentation
- Search for similar issues
- Ask questions in discussions
- Join our Discord/Slack (if available)

---

Thank you for contributing to Smart Starterkit! 🎉