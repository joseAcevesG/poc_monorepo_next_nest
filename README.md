# Monorepo POC - Full-Stack Validation Demo

A proof-of-concept monorepo demonstrating modern full-stack development patterns with shared validation logic. The application implements a simple "hello world" validation flow where users input "hello" and receive "world" as a response, showcasing consistent validation across frontend and backend using shared Zod schemas.

## 🏗️ Architecture Overview

This monorepo demonstrates:

- **Shared Validation Logic**: Zod schemas used consistently across frontend and backend
- **Independent Deployments**: Separate CI/CD pipelines for each service
- **Modern Tooling**: Next.js 15, Nest.js, TypeScript, pnpm workspaces, and Turborepo
- **Containerized Deployment**: Docker-based deployment to AWS EC2 instances

## 📁 Project Structure

```
monorepo-poc/
├── apps/                          # Application packages
│   ├── frontend/                  # Next.js 15 application
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   ├── components/       # React components
│   │   │   └── lib/              # Utility functions
│   │   ├── Dockerfile            # Multi-stage Docker build
│   │   └── package.json          # Frontend dependencies
│   └── backend/                   # Nest.js application
│       ├── src/
│       │   ├── controllers/      # API controllers
│       │   ├── services/         # Business logic
│       │   ├── dto/              # Data transfer objects
│       │   └── main.ts           # Application entry point
│       ├── Dockerfile            # Multi-stage Docker build
│       └── package.json          # Backend dependencies
├── packages/                      # Shared packages
│   └── schemas/                   # Zod validation schemas
│       ├── src/
│       │   ├── hello.schema.ts   # Hello validation schemas
│       │   └── index.ts          # Package exports
│       └── package.json          # Schema package config
├── .github/
│   └── workflows/                 # CI/CD pipelines
│       ├── deploy-frontend.yml   # Frontend deployment
│       └── deploy-backend.yml    # Backend deployment
├── aws-setup/                     # AWS infrastructure guides
│   ├── README.md                 # AWS Academy setup guide
│   ├── PERSONAL-ACCOUNT-SETUP.md # Personal AWS account setup
│   └── ACADEMY-LIMITATIONS.md    # AWS Academy limitations
├── docker-compose.yml             # Local development environment
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml            # pnpm workspace config
├── package.json                   # Root package.json
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** (required for all applications)
- **pnpm 10+** (package manager)
- **Docker** (for containerization)
- **AWS Account** (for deployment)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd monorepo-poc
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development servers**

   ```bash
   # Start all services (frontend + backend)
   pnpm dev

   # Or start individual services
   pnpm --filter @monorepo-poc/frontend dev    # Frontend only
   pnpm --filter @monorepo-poc/backend dev     # Backend only
   ```

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Test endpoint: http://localhost:3001/hello

### Testing the Application

1. **Run all tests**

   ```bash
   pnpm test
   ```

2. **Run tests for specific packages**

   ```bash
   pnpm --filter @monorepo-poc/schemas test    # Schema validation tests
   pnpm --filter @monorepo-poc/frontend test   # Frontend component tests
   pnpm --filter @monorepo-poc/backend test    # Backend API tests
   ```

3. **Manual testing**
   - Open http://localhost:3000
   - Enter "hello" in the input field
   - Submit the form
   - Verify you receive "world" as response

## 🔧 Development Workflow

### Adding Dependencies

Always use pnpm CLI with exact versions:

```bash
# Add to root workspace
pnpm add -E <package>

# Add to specific workspace
pnpm --filter @monorepo-poc/frontend add -E <package>
pnpm --filter @monorepo-poc/backend add -E <package>
pnpm --filter @monorepo-poc/schemas add -E <package>

# Add dev dependencies
pnpm add -ED <package>
```

### Code Quality and Formatting

This project uses **Biome 2.2** as the linter and formatter:

```bash
# Format code (replaces Prettier)
pnpm format

# Check formatting without making changes
pnpm format:check

# Lint code with Biome
pnpm lint

# Combined check and format
pnpm check
```

**Biome Features:**

- **Domains**: Automatic framework detection and rule activation
- **Monorepo Support**: Hierarchical configuration with app-specific overrides
- **Performance**: Significantly faster than traditional ESLint + Prettier setup
- **Next.js Domain**: Automatic Next.js-specific rules when Next.js ≥14.0.0 detected
- **React Domain**: React hooks and JSX linting when React ≥16.0.0 detected
- **Project Domain**: Cross-file analysis and import cycle detection

### Building Applications

```bash
# Build all packages (uses Turborepo caching)
turbo build

# Build specific package and its dependencies
turbo build --filter=@monorepo-poc/frontend
turbo build --filter=@monorepo-poc/backend

# Clean all build artifacts
turbo clean
```

### Working with Shared Schemas

The `@monorepo-poc/schemas` package contains shared Zod validation schemas:

```typescript
// In frontend or backend code
import { HelloInputSchema, HelloResponseSchema } from "@monorepo-poc/schemas";

// Validate input
const result = HelloInputSchema.safeParse(userInput);
if (result.success) {
	// Input is valid
	console.log(result.data);
} else {
	// Handle validation errors
	console.error(result.error.issues);
}
```

## 🐳 Docker Development

### Local Docker Environment

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Building Individual Images

```bash
# Build frontend image
docker build -f apps/frontend/Dockerfile -t monorepo-poc-frontend .

# Build backend image
docker build -f apps/backend/Dockerfile -t monorepo-poc-backend .
```

## 🚀 Deployment

### AWS Infrastructure Setup

Before deploying, you need to set up AWS infrastructure:

1. **For AWS Academy users**: Follow [aws-setup/README.md](./aws-setup/README.md)
2. **For personal AWS accounts**: Follow [aws-setup/PERSONAL-ACCOUNT-SETUP.md](./aws-setup/PERSONAL-ACCOUNT-SETUP.md)

### GitHub Actions Secrets

Configure these secrets in your GitHub repository:

| Secret Name                | Description       | Example                                                           |
| -------------------------- | ----------------- | ----------------------------------------------------------------- |
| `AWS_ACCESS_KEY_ID`        | AWS access key    | From AWS IAM or Academy                                           |
| `AWS_SECRET_ACCESS_KEY`    | AWS secret key    | From AWS IAM or Academy                                           |
| `AWS_SESSION_TOKEN`        | AWS session token | Required for AWS Academy                                          |
| `AWS_REGION`               | AWS region        | `us-east-1`                                                       |
| `ECR_FRONTEND_REPOSITORY`  | Frontend ECR URI  | `123456789.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-frontend` |
| `ECR_BACKEND_REPOSITORY`   | Backend ECR URI   | `123456789.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-backend`  |
| `EC2_FRONTEND_HOST`        | Frontend EC2 IP   | `1.2.3.4`                                                         |
| `BACKEND_EC2_IP`           | Backend EC2 IP    | `5.6.7.8`                                                         |
| `EC2_FRONTEND_PRIVATE_KEY` | SSH private key   | EC2 key pair private key                                          |

### Deployment Process

Deployments are triggered automatically:

- **Frontend**: Changes to `apps/frontend/` or `packages/schemas/`
- **Backend**: Changes to `apps/backend/` or `packages/schemas/`

Manual deployment:

```bash
# Trigger frontend deployment
gh workflow run deploy-frontend.yml

# Trigger backend deployment
gh workflow run deploy-backend.yml
```

## 🛠️ Technology Stack

| Component              | Technology     | Version |
| ---------------------- | -------------- | ------- |
| **Runtime**            | Node.js        | 22+     |
| **Package Manager**    | pnpm           | 10+     |
| **Build System**       | Turborepo      | 2.5+    |
| **Frontend**           | Next.js        | 15      |
| **Backend**            | Nest.js        | Latest  |
| **Validation**         | Zod            | 4.1.4   |
| **Testing**            | Vitest         | 3.2.4   |
| **Linting/Formatting** | Biome          | 2.2.2   |
| **Containerization**   | Docker         | Latest  |
| **CI/CD**              | GitHub Actions | -       |
| **Cloud**              | AWS (ECR, EC2) | -       |

## 📋 Available Scripts

### Root Level Scripts

```bash
pnpm dev          # Start all services in development mode
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm lint         # Lint with Biome
pnpm format       # Format code with Biome
pnpm check        # Combined lint and format check
pnpm clean        # Clean all build artifacts
```

### Package-Specific Scripts

```bash
# Frontend
pnpm --filter @monorepo-poc/frontend dev
pnpm --filter @monorepo-poc/frontend build
pnpm --filter @monorepo-poc/frontend test

# Backend
pnpm --filter @monorepo-poc/backend dev
pnpm --filter @monorepo-poc/backend build
pnpm --filter @monorepo-poc/backend test

# Schemas
pnpm --filter @monorepo-poc/schemas build
pnpm --filter @monorepo-poc/schemas test
```

## 🔍 Features Demonstrated

### Shared Validation Logic

- Zod schemas defined once in `packages/schemas`
- Used consistently across frontend and backend
- Type-safe validation with TypeScript integration

### Monorepo Benefits

- Code sharing between applications
- Consistent tooling and configuration
- Efficient builds with Turborepo caching
- Simplified dependency management

### Modern Development Practices

- TypeScript strict mode
- Component testing with React Testing Library
- API testing with Supertest
- Docker multi-stage builds
- CI/CD with GitHub Actions

### Independent Deployments

- Separate pipelines for frontend and backend
- Selective deployment based on changed files
- Docker containerization for consistency
- AWS ECR for image storage

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## 📚 Additional Documentation

### Setup and Development

- [Local Development Workflow](./LOCAL-DEVELOPMENT.md) - Complete local development guide
- [Environment Configuration](./ENVIRONMENT.md) - Environment variables and secrets management
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions

### AWS Deployment

- [AWS Setup Guide](./aws-setup/README.md) - AWS Academy infrastructure setup
- [Personal AWS Setup](./aws-setup/PERSONAL-ACCOUNT-SETUP.md) - Personal account setup
- [AWS Academy Limitations](./aws-setup/ACADEMY-LIMITATIONS.md) - Academy-specific constraints
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions

### Quick Reference

- [Frontend Environment Example](./apps/frontend/.env.example) - Frontend environment template
- [Backend Environment Example](./apps/backend/.env.example) - Backend environment template

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## 📄 License

This project is for educational purposes as a proof-of-concept demonstration.
