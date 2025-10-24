# Smart StarterKit - Boilerplate Guide

This is a **clean starterkit template** ready for your custom features!

## 🚀 Quick Start

```bash
# Clone and setup
git clone <your-repo>
cd smart-starterkit
bun install

# Start development
bun run dev
```

## 📁 Folder Structure

### Client (`client/src/`)
- `routes/` - File-based routing (TanStack Router)
  - `index.tsx` - Home page (design system showcase)
  - `__root.tsx` - Root layout
  - `-components/` - Page-specific components (empty template)
- `components/` - React components
  - `ui/` - shadcn/ui base components
  - `blocks/` - Reusable feature components
    - `cards/` - Card components (metric, progress, status, feature cards)
    - `forms/` - Form components (inputs, selects, checkboxes, etc.)
    - `tables/` - Table components (basic, advanced, with checkboxes)
    - `toasts/` - Toast notification components
    - `alerts/` - Alert components
    - `navigation/` - Navigation components
- `hooks/` - Custom React hooks (auth template included)
- `store/` - State management
- `services/` - API service functions
- `middleware/` - Client middleware

### Server (`server/src/`)
- `route/` - API route definitions
- `controller/` - Request handlers
- `service/` - Business logic
- `schemas/` - Zod validation schemas
- `middleware/` - Server middleware (auth template included)
- `utils/` - Utility functions
- `database/`
  - `migrations/` - Database migrations
  - `seeds/` - Seed data files
- `jobs/` - Background jobs
- `queue/` - Queue management

### Shared (`shared/src/`)
- `types/` - TypeScript types (common types included)
- `utils/` - Shared utilities
- `constants/` - Shared constants
- `validation/` - Zod schemas
- `hooks/` - Shared hooks
- `middleware/` - Shared middleware

### Project Level
- `docs/` - Documentation
- `scripts/` - Automation scripts
- `tests/` - Test files
- `tools/` - Development tools
- `docker/` - Docker configuration
- `k8s/` - Kubernetes manifests

## 🛠️ Adding Features

### 1. New API Endpoint
```bash
# Create files:
server/src/route/your-resource.route.ts
server/src/controller/your-resource.controller.ts
server/src/service/your-resource.service.ts
server/src/schemas/your-resource.schema.ts
```

### 2. New Page
```bash
# Create route file:
client/src/routes/your-page.tsx
# Create components folder:
mkdir -p client/src/routes/your-page/-components
```

### 3. Add to Navigation
Update `client/src/components/layout/app-sidebar.tsx`

## 📋 Templates Included

- **Authentication Hook**: `client/src/hooks/useAuth.ts`
- **Admin Dashboard**: `client/src/routes/admin/index.tsx`
- **Auth Middleware**: `server/src/middleware/auth.middleware.ts`
- **Common Types**: `shared/src/types/common.type.ts`

## 🎯 Next Steps

1. **Configure Database**: Update `server/database/query.sql`
2. **Setup Auth**: Implement JWT/session management
3. **Add Your Features**: Follow the folder structure
4. **Customize UI**: Modify shadcn/ui components
5. **Add Tests**: Set up testing framework
6. **Deploy**: Configure Docker/K8s

## 📚 Documentation

See `CLAUDE.md` for detailed development guidelines.

---

**Happy Coding! 🎉**