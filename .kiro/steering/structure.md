---
inclusion: always
---

# Project Structure & Organization

## Monorepo Layout

This is a pnpm + Turborepo monorepo with the following structure:

```
monorepo-poc/
├── apps/                          # Deployable applications
│   ├── frontend/                  # Next.js 15 App Router
│   └── backend/                   # Nest.js API server
├── packages/                      # Shared packages
│   └── schemas/                   # Zod validation schemas
├── .github/workflows/             # CI/CD pipelines
├── aws-setup/                     # AWS deployment scripts
├── docker-compose.yml             # Local development
├── turbo.json                     # Build pipeline config
└── pnpm-workspace.yaml            # Workspace definition
```

## Directory Structure Rules

### Apps (`apps/`)

- **Frontend**: Next.js 15 with App Router (`src/app/`, `src/components/`, `src/lib/`)
- **Backend**: Nest.js with standard structure (`src/controllers/`, `src/services/`, `src/dto/`)
- Each app has its own `package.json`, `Dockerfile`, and config files
- Both apps import from `@monorepo-poc/schemas` package

### Packages (`packages/`)

- **Schemas**: Single source of truth for Zod validation schemas
- Export all schemas and types from `src/index.ts`
- Use workspace protocol: `"@monorepo-poc/schemas": "workspace:*"`

## File Naming Conventions

- **Directories**: kebab-case (`apps/frontend/`, `src/controllers/`)
- **TypeScript files**: camelCase (`helloSchema.ts`, `apiClient.ts`)
- **React components**: PascalCase (`HelloForm.tsx`)
- **Test files**: `.test.ts` or `.spec.ts` suffix
- **Config files**: lowercase (`package.json`, `dockerfile`)

## Import/Export Patterns

```typescript
// Schemas package - always export from index.ts
export { HelloInputSchema, HelloResponseSchema } from "./hello.schema";
export type { HelloInput, HelloResponse } from "./hello.schema";

// Applications - import from scoped package
import { HelloInputSchema } from "@monorepo-poc/schemas";
import type { HelloInput } from "@monorepo-poc/schemas";
```

## Dependency Management Rules

- **Internal packages**: Always use `"@monorepo-poc/schemas": "workspace:*"`
- **External packages**: Add with exact versions using pnpm CLI
- **Shared dependencies**: Place in root `package.json` when used by multiple apps
- **Never manually edit package.json** - always use `pnpm add -E <package>`

## Key Configuration Files

- **Root**: `turbo.json` (build pipeline), `pnpm-workspace.yaml` (workspaces)
- **Frontend**: `next.config.ts`, `vitest.config.ts`
- **Backend**: `nest-cli.json`, `vitest.config.ts`, `vitest.e2e.config.ts`
- **Schemas**: `tsconfig.json`, `vitest.config.ts`

## Development Commands

```bash
# Setup and development
pnpm install                           # Install all dependencies
pnpm dev                              # Start all services (frontend:3000, backend:3001)
pnpm --filter <package> dev           # Start specific service

# Building (prefer Turborepo)
turbo build                           # Build all packages
turbo build --filter=<package>        # Build specific package

# Testing
turbo test                            # Run all tests
pnpm --filter <package> test          # Test specific package
```

## Adding New Files/Packages

1. **New components**: Place in appropriate `src/` directory
2. **New packages**: Add to `packages/` and update `pnpm-workspace.yaml`
3. **New dependencies**: Use `pnpm add -E <package>` with exact versions
4. **Schema changes**: Update in `packages/schemas/src/` and export from `index.ts`
