# Monorepo POC

A proof-of-concept monorepo demonstrating modern full-stack development patterns with shared validation logic.

## Structure

```
monorepo-poc/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Nest.js application
├── packages/
│   └── schemas/           # Shared Zod validation schemas
├── package.json           # Root package.json with workspace config
├── pnpm-workspace.yaml    # pnpm workspace configuration
├── turbo.json            # Turborepo configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

```bash
# Start all services
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Features

- **Shared Validation**: Zod schemas used consistently across frontend and backend
- **Simple Flow**: User inputs "hello" → system validates → returns "world"
- **Independent Deployment**: Separate CI/CD pipelines for frontend and backend
- **Containerized**: Docker-based deployment to EC2 instances
