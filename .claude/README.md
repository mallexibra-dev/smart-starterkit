# Claude Rules & Guidelines

This directory contains comprehensive rules and guidelines for Claude Code to follow when working with the Smart Starterkit project.

## 📁 Directory Structure

```
.claude/
├── rules/
│   ├── frontend.md    # Frontend development rules
│   ├── backend.md     # Backend development rules
│   ├── shared.md      # Shared package development rules
│   └── general.md     # General development guidelines
├── prompts/           # Specialized prompts for specific tasks
└── README.md          # This file
```

## 🎯 How to Use These Rules

### For Claude Code
- **Read relevant rules** before starting any task
- **Follow checklists** in each rule file
- **Apply patterns** consistently across the codebase
- **Ask for clarification** if rules are unclear

### For Developers
- **Review rules** to understand project standards
- **Update rules** when patterns change
- **Enforce rules** during code reviews
- **Contribute improvements** to guidelines

## 📋 Rule Categories

### 🖥️ Frontend Rules (`frontend.md`)
- Component organization and naming
- File structure compliance
- shadcn/ui usage patterns
- TanStack Query implementation
- TypeScript and accessibility standards

### 🔧 Backend Rules (`backend.md`)
- Minimal architecture patterns
- Route and controller organization
- Database operations with Drizzle
- API security and validation
- Hono framework best practices

### 🔗 Shared Rules (`shared.md`)
- Type definition patterns
- Zod validation schemas
- Utility function standards
- Cross-package consistency
- Platform-agnostic design

### 📖 General Rules (`general.md`)
- Development workflow
- Git and commit standards
- Code quality principles
- Security guidelines
- Testing philosophy

## 🚀 Quick Reference

### Before Starting Any Task
1. **Read relevant rule files** for your domain
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

1. **Component Organization**: Must be in correct subfolder
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
- **Suggest improvements** to guidelines

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

**These rules ensure consistent, high-quality development across the Smart Starterkit project. Follow them strictly!** 🚀