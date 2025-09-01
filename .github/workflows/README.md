# GitHub Actions Workflows

This directory contains CI/CD workflows for the monorepo-poc project.

## Continuous Integration Workflow

The `ci.yml` workflow handles code quality checks for pull requests and main branch pushes.

### Workflow Features

- **Code Quality Checks**: Runs on all pushes to main and pull requests
- **Biome Integration**: Uses Biome for linting and formatting checks
- **ESLint Fallback**: Runs ESLint for rules not supported by Biome
- **Affected Package Testing**: On PRs, only tests packages affected by changes
- **Turborepo Caching**: Optimized build and test execution with caching

### Quality Gates

1. **Format Check**: Verifies code formatting with Biome
2. **Lint Check**: Runs both Biome and ESLint linting
3. **Build Check**: Ensures all packages build successfully
4. **Test Check**: Runs all tests and verifies they pass

## Frontend Deployment Workflow

The `deploy-frontend.yml` workflow handles building and deploying the Next.js frontend application to EC2.

### Required GitHub Secrets

The following secrets must be configured in your GitHub repository settings:

#### AWS Configuration

- `AWS_ACCESS_KEY_ID`: AWS access key for ECR and EC2 access
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for ECR and EC2 access

#### EC2 Deployment

- `EC2_FRONTEND_HOST`: Public IP or hostname of the frontend EC2 instance
- `EC2_FRONTEND_PRIVATE_KEY`: Private SSH key for accessing the frontend EC2 instance (PEM format)

#### Application Configuration

- `BACKEND_EC2_IP`: Public IP address of the backend EC2 instance (e.g., `54.123.45.67`)

### Workflow Triggers

The workflow triggers on:

- Push to `main` branch with changes to:
  - `apps/frontend/**`
  - `packages/schemas/**`
  - `.github/workflows/deploy-frontend.yml`
- Manual workflow dispatch

### Workflow Steps

1. **Setup**: Checkout code, setup Node.js 22, install pnpm
2. **Cache**: Setup pnpm and Turborepo caching for faster builds
3. **Format Check**: Verify code formatting with Biome
4. **Lint Check**: Run Biome and ESLint linting on affected packages
5. **Build**: Install dependencies and build affected packages using Turborepo
6. **Test**: Run tests for affected packages
7. **Docker**: Build and push Docker image to AWS ECR
8. **Deploy**: Deploy container to EC2 instance with zero-downtime strategy
9. **Health Check**: Verify deployment success with HTTP health check

### ECR Repository

The workflow expects an ECR repository named `monorepo-poc-frontend` to exist in your AWS account.

### EC2 Instance Requirements

The target EC2 instance must have:

- Docker installed and running
- AWS CLI configured with ECR access (via IAM role)
- SSH access configured for the deployment user
- Port 3000 accessible for the application

### Environment Variables

The deployed container receives these environment variables:

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL`: Constructed from `BACKEND_EC2_IP` as `http://{ip}:3001`

### Deployment Strategy

- Zero-downtime deployment using container replacement
- Automatic cleanup of old Docker images (keeps last 3)
- Health check verification after deployment
- Rollback capability through container restart policies

## Backend Deployment Workflow

The `deploy-backend.yml` workflow handles building and deploying the Nest.js backend application to EC2.

### Required GitHub Secrets

The following secrets must be configured in your GitHub repository settings:

#### AWS Configuration

- `AWS_ACCESS_KEY_ID`: AWS access key for ECR and EC2 access
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key for ECR and EC2 access

#### EC2 Deployment

- `BACKEND_EC2_IP`: Public IP address of the backend EC2 instance
- `EC2_FRONTEND_PRIVATE_KEY`: Private SSH key for accessing the EC2 instances (PEM format)

### Workflow Triggers

The workflow triggers on:

- Push to `main` branch with changes to:
  - `apps/backend/**`
  - `packages/schemas/**`
  - `.github/workflows/deploy-backend.yml`
- Manual workflow dispatch

### Workflow Steps

1. **Setup**: Checkout code, setup Node.js 22, install pnpm
2. **Cache**: Setup pnpm and Turborepo caching for faster builds
3. **Format Check**: Verify code formatting with Biome
4. **Lint Check**: Run Biome and ESLint linting on affected packages
5. **Build**: Install dependencies and build affected packages using Turborepo
6. **Test**: Run tests for affected packages
7. **Docker**: Build and push Docker image to AWS ECR
8. **Deploy**: Deploy container to EC2 instance with zero-downtime strategy
9. **Health Check**: Verify deployment success with HTTP health check

### ECR Repository

The workflow expects an ECR repository named `monorepo-poc-backend` to exist in your AWS account.

### Environment Variables

The deployed container receives these environment variables:

- `NODE_ENV=production`
- `PORT=3001`

## Code Quality Integration

All deployment workflows now include Biome-based code quality checks:

- **Format Verification**: Ensures code follows consistent formatting rules
- **Linting**: Runs both Biome (primary) and ESLint (fallback) for comprehensive code analysis
- **Fail Fast**: Deployments are blocked if code quality checks fail
- **Turborepo Optimization**: Quality checks are cached and run only on affected packages
