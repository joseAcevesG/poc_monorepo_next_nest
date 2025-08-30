# GitHub Actions Workflows

This directory contains CI/CD workflows for the monorepo-poc project.

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
3. **Build**: Install dependencies and build affected packages using Turborepo
4. **Test**: Run tests for affected packages
5. **Docker**: Build and push Docker image to AWS ECR
6. **Deploy**: Deploy container to EC2 instance with zero-downtime strategy
7. **Health Check**: Verify deployment success with HTTP health check

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
