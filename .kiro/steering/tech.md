---
inclusion: always
---

# Technology Stack & Development Guidelines

## Required Technologies

- **Node.js 22**: Use for all applications and packages
- **TypeScript**: Enable strict mode, use explicit types
- **pnpm**: Only package manager allowed (never npm/yarn)
- **Turborepo**: Use for all build operations and caching
- **Zod 4.1.4**: Required for all validation schemas
- **Vitest 3.2.4**: Required for testing (not Jest)

## Framework Requirements

### Frontend (Next.js 15)

- Use App Router (not Pages Router)
- Import shared schemas from `@monorepo-poc/schemas`
- Use React Testing Library for component tests
- Follow Next.js 15 conventions for file structure

### Backend (Nest.js)

- Use TypeScript decorators for controllers/services
- Import shared schemas from `@monorepo-poc/schemas`
- Use Supertest for API integration tests
- Follow Nest.js module structure patterns

### Shared Packages

- Export schemas and types from single index.ts
- Use Vitest 3.2.4 for testing (not Jest)
- Build with TypeScript compiler

## Dependency Management

**CRITICAL**: Always use CLI commands to add dependencies, never manually edit package.json files.

**REQUIRED**: Always specify exact versions when adding dependencies to ensure consistency across the monorepo.

```bash
# Add dependencies using pnpm CLI with exact versions
pnpm add -E <package>                 # Add production dependency
pnpm add -ED <package>             # Add dev dependency
pnpm --filter <workspace> add -E <package>  # Add to specific workspace

# Examples with exact versions
pnpm add -E zod                         # Add to root
pnpm --filter @monorepo-poc/schemas add -E zod  # Add to schemas package
pnpm add -ED vitest                   # Add dev dependency
pnpm add -ED typescript               # Add TypeScript dev dependency
```

## Command Patterns

Always use these exact commands:

```bash
# Development
pnpm install                    # Install dependencies
pnpm dev                       # Start all services
pnpm --filter <package> dev    # Start specific service

# Building (prefer Turborepo)
turbo build                    # Build all packages
turbo build --filter=<package> # Build specific package

# Testing
turbo test                     # Run all tests
pnpm --filter <package> test   # Test specific package
```

## Code Conventions

### Package Dependencies

- Internal deps: `"@monorepo-poc/schemas": "workspace:*"`
- Always use workspace protocol for internal packages
- Place shared deps in root package.json when possible

### TypeScript Configuration

- Enable strict mode in all tsconfig.json files
- Use explicit return types for functions
- Import types with `import type` syntax

### Validation Patterns

```typescript
// Always import from shared schemas
import { HelloInputSchema } from "@monorepo-poc/schemas";

// Use .parse() for validation with errors
const validated = HelloInputSchema.parse(input);

// Use .safeParse() when handling user input
const result = HelloInputSchema.safeParse(input);
```

### File Naming

- TypeScript files: camelCase (helloSchema.ts)
- React components: PascalCase (HelloForm.tsx)
- Test files: .test.ts or .spec.ts suffix
- Config files: lowercase (package.json, dockerfile)

## Docker Requirements

- Use Node.js 22 Alpine base images only
- Multi-stage builds required for production
- Include proper .dockerignore files
- Build from monorepo root with proper context

## Build Pipeline Rules

- All builds must go through Turborepo
- Configure task dependencies in turbo.json
- Use caching for all build operations
- Test before build in CI/CD pipelines
