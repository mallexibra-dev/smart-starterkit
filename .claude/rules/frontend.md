# Frontend Development Rules

## 🎯 Component Organization

### 📁 Component Folder Structure
```
client/src/components/
├── ui/              # Base shadcn/ui components ONLY
├── blocks/          # Reusable feature components (combinations of shadcn-ui)
└── layout/          # Layout components and error handling ONLY
```

### 🔧 Component Rules
- **NO components in root folder** - must be in subfolder
- **UI Components**: Base components go in `ui/`
- **Feature Components**: Reusable combinations go in `blocks/`
- **Layout Components**: Layout, error handling go in `layout/`

### 📝 Naming Conventions
- **File names**: kebab-case (e.g., `user-card.tsx`, `loading-spinner.tsx`)
- **Component exports**: PascalCase (e.g., `export function UserCard()`)
- **Consistent naming**: Follow established patterns

## 🗂️ File Organization

### ✅ Correct File Placement
- **Components**: Only in `src/components/{ui|blocks|layout}/`
- **Routes**: Only in `src/routes/`
- **Services**: Only in `src/services/` (when needed)
- **Hooks**: Only in `src/hooks/`
- **Contexts**: Only in `src/contexts/`
- **Lib**: Only in `src/lib/`

### ❌ Incorrect Placement
- **NO** components in wrong folders
- **NO** services without actual API usage
- **NO** files in root directories
- **NO** duplicate logic

## 🌐 Services & API

### TanStack Query Services
- **Create ONLY when features need API calls**
- **Use TanStack Query** for all API communication
- **Clean directory**: Keep `src/services/` clean until needed
- **Axios**: Use axios for HTTP requests with proxy configuration

### Service File Structure
```
src/services/
├── .gitkeep         # Keep directory clean
└── [resource].service.ts  # Create only when needed
```

## 🎨 UI Development

### shadcn/ui Usage
- **USE existing UI components** whenever possible
- **CHECK component library** before creating custom
- **FOLLOW shadcn patterns** for consistency
- **PROPER accessibility** with ARIA attributes

### Component Best Practices
- **Composition over inheritance**
- **TypeScript prop interfaces**
- **Semantic HTML**
- **Proper error boundaries**
- **Loading states**

## 📦 Import Standards

### Import Order
1. React/React Router imports
2. Third-party libraries
3. Workspace imports (shared)
4. Local imports (relative paths)

### Import Examples
```tsx
import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { User } from 'shared/src/types';
import { CustomComponent } from './components/custom-component';
```

## 🔍 Quality Standards

### TypeScript Rules
- **STRICT typing** for all new code
- **Proper interfaces** for props and data
- **NO any types** unless absolutely necessary
- **Type safety** everywhere

### Error Handling
- **Error boundaries** for component trees
- **Loading states** for async operations
- **User-friendly error messages**
- **Proper fallbacks**

### Accessibility
- **Semantic HTML5** elements
- **ARIA attributes** where needed
- **Keyboard navigation** support
- **Screen reader** compatibility

## 🛑 What NOT to Do

- **NEVER** create components without checking existing ones
- **NEVER** place files in wrong directories
- **NEVER** ignore TypeScript strict mode
- **NEVER** create service files without API usage
- **NEVER** duplicate component logic
- **NEVER** use inline styles (use Tailwind)

## ✅ What to Always Do

- **ALWAYS** check existing patterns first
- **ALWAYS** use shared types for data structures
- **ALWAYS** follow folder structure rules
- **ALWAYS** implement proper error handling
- **ALWAYS** write accessible components
- **ALWAYS** use proper TypeScript types

## 🚀 Development Workflow

1. **Check existing components** before creating new ones
2. **Use established patterns** from codebase
3. **Follow folder structure** strictly
4. **Implement proper types** and validation
5. **Add error handling** and loading states
6. **Test accessibility** and responsiveness
7. **Verify no unused files** created

## 📋 Quality Checklist

Before completing frontend tasks:
- [ ] Components are in correct folders (ui/blocks/layout)
- [ ] Naming conventions followed (kebab-case files, PascalCase exports)
- [ ] TypeScript types are proper and strict
- [ ] Error handling implemented
- [ ] Accessibility considered
- [ ] No unused files created
- [ ] Shared types used where appropriate
- [ ] Existing components reused when possible

**Frontend development must follow these rules strictly!** 🚀