# Project Structure & Organization

## Monorepo Layout

```
monorepo-poc/
├── apps/                          # Application packages
│   ├── frontend/                  # Next.js application
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   ├── components/       # React components
│   │   │   └── lib/              # Utility functions
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── next.config.js
│   └── backend/                   # Nest.js application
│       ├── src/
│       │   ├── controllers/      # API controllers
│       │   ├── services/         # Business logic
│       │   ├── dto/              # Data transfer objects
│       │   └── main.ts           # Application entry point
│       ├── Dockerfile
│       ├── package.json
│       └── nest-cli.json
├── packages/                      # Shared packages
│   └── schemas/                   # Zod validation schemas
│       ├── src/
│       │   ├── hello.schema.ts   # Hello validation schemas
│       │   └── index.ts          # Package exports
│       ├── package.json
│       └── tsconfig.json
├── .github/
│   └── workflows/                 # CI/CD pipelines
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
├── docker-compose.yml             # Local development
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml            # pnpm workspace config
├── package.json                   # Root package.json
└── README.md
```

## Package Organization

### Apps Directory (`apps/`)

Contains deployable applications that depend on shared packages.

**Frontend (`apps/frontend/`)**:

- Next.js 14 application with App Router
- Uses shared schemas for client-side validation
- Minimal UI focused on the hello/world validation flow
- Containerized for deployment to EC2

**Backend (`apps/backend/`)**:

- Nest.js API application
- Uses shared schemas for request validation
- RESTful API with single POST /hello endpoint
- Containerized for deployment to EC2

### Packages Directory (`packages/`)

Contains shared code used by multiple applications.

**Schemas (`packages/schemas/`)**:

- Zod validation schemas and TypeScript types
- Exported for use by both frontend and backend
- Single source of truth for validation logic
- Minimal, focused on hello/world validation

## Naming Conventions

### Files and Directories

- Use kebab-case for directory names: `apps/frontend/`, `packages/schemas/`
- Use camelCase for TypeScript files: `helloSchema.ts`, `apiClient.ts`
- Use PascalCase for React components: `HelloForm.tsx`, `ErrorMessage.tsx`
- Use lowercase for configuration files: `package.json`, `dockerfile`

### Package Names

- Scoped packages: `@monorepo-poc/schemas`
- Consistent naming across workspace
- Clear, descriptive names that indicate purpose

### Import/Export Patterns

```typescript
// Shared schemas package exports
export { HelloInputSchema, HelloResponseSchema } from "./hello.schema";
export type { HelloInput, HelloResponse } from "./hello.schema";

// Application imports
import { HelloInputSchema } from "@monorepo-poc/schemas";
```

## Workspace Dependencies

### Internal Dependencies

- Use workspace protocol: `"@monorepo-poc/schemas": "workspace:*"`
- Both apps depend on schemas package
- Automatic linking via pnpm workspaces

### External Dependencies

- Shared dependencies in root package.json when possible
- Application-specific dependencies in respective package.json
- Use exact versions for consistency

## Configuration Files

### Root Level

- `package.json`: Workspace configuration and shared scripts
- `pnpm-workspace.yaml`: Workspace package definitions
- `turbo.json`: Build pipeline and caching configuration
- `docker-compose.yml`: Local development environment

### Application Level

- Each app has its own `package.json` with specific dependencies
- Framework-specific config files (next.config.js, nest-cli.json)
- Individual Dockerfiles for containerization

## Development Workflow

### Local Development

1. Install dependencies: `pnpm install`
2. Start all services: `pnpm dev`
3. Access frontend at http://localhost:3000
4. Access backend at http://localhost:3001

### Making Changes

- Shared schema changes automatically affect both apps
- Use Turborepo for efficient builds: `turbo build`
- Test changes across all affected packages: `turbo test`

### Adding New Packages

- Create in appropriate directory (apps/ or packages/)
- Add to pnpm-workspace.yaml if needed
- Configure dependencies using workspace protocol
- Update turbo.json for build pipeline integration
