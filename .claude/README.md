# Claude Rules & Guidelines

This directory contains comprehensive rules, guidelines, and specialized agents for Claude Code to follow when working with the Smart Starterkit project.

## 📁 Directory Structure

```
.claude/
├── agents/           # Specialized Claude agents for specific tasks
│   ├── fullstack-feature-architect.md  # Complete feature development
│   ├── react-component-architect.md    # Reusable component creation
│   └── testing-specialist.md           # Testing strategies
├── rules/            # Development rules by domain
│   ├── frontend.md   # Frontend development rules
│   ├── backend.md    # Backend development rules
│   ├── shared.md     # Shared package development rules
│   └── general.md    # General development guidelines
└── README.md         # This file
```

## 🤖 Specialized Agents

This project includes specialized Claude agents for different development tasks:

### **fullstack-feature-architect** 🟣
- **Purpose**: Build complete features from database to frontend UI
- **When to use**: Creating new features that require backend API, database schema, and frontend implementation
- **Deliverables**: Complete database layer, backend API, shared infrastructure, frontend implementation, UX, and integration testing

### **react-component-architect** 🔵
- **Purpose**: Create reusable React components with shadcn/ui integration
- **When to use**: Building reusable components, component architecture review, UI component creation
- **Deliverables**: Complete implementation with TypeScript interfaces, shadcn/ui integration, usage examples, and documentation

### **testing-specialist** 🟢
- **Purpose**: Comprehensive testing strategies and test implementation
- **When to use**: Setting up tests, improving test coverage, testing architecture
- **Deliverables**: Unit tests, integration tests, component tests, API tests, and testing infrastructure

## 🎯 How to Use These Rules

### For Claude Code
- **Read relevant rules** before starting any task (MANDATORY for all agents)
- **Follow checklists** in each rule file
- **Apply patterns** consistently across the codebase
- **Use specialized agents** for specific development tasks

### For Developers
- **Review rules** to understand project standards
- **Learn agent capabilities** to leverage them effectively
- **Enforce rules** during code reviews
- **Contribute improvements** to guidelines

## 📋 Rule Categories

### 🖥️ Frontend Rules (`frontend.md`)
- Component organization (ui/blocks/layout folders)
- File structure compliance and naming conventions
- shadcn/ui usage patterns and integration
- TanStack Query implementation and data fetching
- TypeScript strict mode and accessibility standards

### 🔧 Backend Rules (`backend.md`)
- Minimal architecture patterns (route → controller only)
- Database operations with Drizzle ORM
- API security and validation with Zod
- Hono framework best practices and OpenAPI documentation
- Error handling and logging patterns

### 🔗 Shared Rules (`shared.md`)
- Type definition patterns and TypeScript interfaces
- Zod validation schemas as single source of truth
- Utility function standards and cross-package consistency
- Platform-agnostic design principles

### 📖 General Rules (`general.md`)
- Development workflow and project philosophy
- File naming conventions and organization standards
- Git workflow and commit standards
- Code quality principles and security guidelines
- Testing philosophy and developer experience

## 🚀 Agent Usage Examples

### Creating a New Feature
```bash
User: "I need to create a user management system with CRUD operations"
Claude: "I'll use the fullstack-feature-architect agent to build the complete user management feature including database schema, API endpoints, and frontend interface."
```

### Building Reusable Components
```bash
User: "Buatkan aku component reusable untuk user profile card"
Claude: "I'll use the react-component-architect agent to create a reusable user profile card component following our project patterns and shadcn/ui integration."
```

### Setting Up Testing
```bash
User: "I need to add tests for my new API endpoints"
Claude: "I'll use the testing-specialist agent to create comprehensive tests for your API endpoints following our testing infrastructure."
```

## 📋 Quick Reference

### Before Starting Any Task
1. **Read relevant rule files** from `.claude/rules/` (MANDATORY for agents)
2. **Check existing patterns** in the codebase
3. **Follow naming conventions** strictly
4. **Use quality checklists** before completion

### File Organization
- **Frontend**: `client/src/components/{ui|blocks|layout}/`
- **Backend**: `server/src/{routes|controllers|db|middlewares|utils}/`
- **Shared**: `shared/src/{types|validation|utils|constants}/`
- **NO** files in wrong directories

### Naming Conventions
- **Files**: kebab-case (`user-card.tsx`)
- **Components**: PascalCase (`UserCard`)
- **Variables**: camelCase (`userName`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)

## 🛑 Critical Rules (Never Break)

1. **Component Organization**: Must be in correct subfolder (ui/blocks/layout)
2. **Minimal Backend**: No service layer, route → controller only
3. **Services Directory**: Only create when API calls needed
4. **Shared Types**: Single source of truth for data structures
5. **TypeScript Strict Mode**: No exceptions
6. **File Naming**: Follow established patterns
7. **Import Order**: React → third-party → shared → local

## ✅ Quality Standards

### Code Quality
- **100% TypeScript** coverage with strict mode
- **Proper error handling** with user-friendly messages
- **Accessibility compliance** with semantic HTML
- **Performance optimization** with lazy loading
- **Security best practices** throughout

### Developer Experience
- **Clear documentation** for complex logic
- **Consistent patterns** across codebase
- **Helpful error messages** for debugging
- **Fast development workflow** with hot reload
- **Easy onboarding** for new developers

## 🔍 Troubleshooting

### Common Issues
- **Import errors**: Check file paths and organization
- **Type errors**: Verify shared types and validation
- **Build failures**: Follow naming conventions
- **Runtime errors**: Check error boundaries and handling

### Getting Help
- **Review rule files** for relevant domain
- **Check existing patterns** in codebase
- **Ask for clarification** on ambiguous rules
- **Use appropriate agents** for specific tasks

## 📈 Continuous Improvement

### Rule Updates
- **Review quarterly** for relevance
- **Update when patterns** change
- **Add new rules** for emerging practices
- **Remove outdated** guidelines

### Feedback Loop
- **Track rule violations** in development
- **Collect developer feedback** on clarity
- **Measure code quality** improvements
- **Adjust guidelines** based on experience

---

**These rules and agents ensure consistent, high-quality development across the Smart Starterkit project. Follow them strictly and use the specialized agents for best results!** 🚀