# CI/CD Pipeline Setup

This directory contains GitHub Actions workflows for deploying the monorepo-poc applications.

## Prerequisites

### AWS Resources Required

1. **ECR Repositories**:

   - `monorepo-poc-frontend` - for frontend Docker images
   - `monorepo-poc-backend` - for backend Docker images

2. **EC2 Instances**:

   - Frontend EC2 instance with Docker installed
   - Backend EC2 instance with Docker installed
   - Both instances need IAM roles with ECR pull permissions

3. **IAM Configuration**:
   - IAM user for GitHub Actions with ECR push permissions
   - IAM roles for EC2 instances with ECR pull permissions

### GitHub Secrets Required

Add these secrets to your GitHub repository settings:

```
AWS_ACCESS_KEY_ID          # IAM user access key for GitHub Actions
AWS_SECRET_ACCESS_KEY      # IAM user secret key for GitHub Actions
NEXT_PUBLIC_API_URL        # Backend API URL for frontend configuration
```

### Optional Secrets for SSH Deployment

For automated SSH deployment to EC2 instances, add:

```
EC2_FRONTEND_HOST          # Frontend EC2 instance public IP/hostname
EC2_BACKEND_HOST           # Backend EC2 instance public IP/hostname
EC2_SSH_PRIVATE_KEY        # SSH private key for EC2 access
EC2_SSH_USER               # SSH username (usually 'ec2-user' or 'ubuntu')
```

## Workflows

### Frontend Deployment (`deploy-frontend.yml`)

**Triggers**:

- Push to main branch with changes to `apps/frontend/` or `packages/schemas/`
- Pull requests to main branch (build and test only)

**Process**:

1. Checkout code and setup Node.js 22 + pnpm
2. Install dependencies with caching
3. Build affected packages using Turborepo
4. Run tests for affected packages
5. Build Docker image (main branch only)
6. Push to ECR (main branch only)
7. Deploy to EC2 instance (main branch only)

### Backend Deployment (`deploy-backend.yml`)

**Triggers**:

- Push to main branch with changes to `apps/backend/` or `packages/schemas/`
- Pull requests to main branch (build and test only)

**Process**:

1. Checkout code and setup Node.js 22 + pnpm
2. Install dependencies with caching
3. Build affected packages using Turborepo
4. Run tests for affected packages
5. Build Docker image (main branch only)
6. Push to ECR (main branch only)
7. Deploy to EC2 instance (main branch only)

## Deployment Strategy

### Current Implementation

The workflows create deployment scripts that can be manually executed on EC2 instances. This approach is suitable for POC environments where full automation may not be necessary.

### Production Considerations

For production deployments, consider:

1. **SSH Automation**: Use SSH actions to automatically execute deployment scripts
2. **Blue-Green Deployment**: Implement zero-downtime deployments
3. **Health Checks**: Add proper health check endpoints and validation
4. **Rollback Strategy**: Implement automatic rollback on deployment failures
5. **Secrets Management**: Use AWS Secrets Manager or Parameter Store
6. **Load Balancers**: Use ALB/ELB for high availability

## Manual Deployment Steps

If automated deployment fails, you can manually deploy:

1. **SSH to EC2 instance**:

   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-instance
   ```

2. **Login to ECR**:

   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   ```

3. **Pull and run container**:
   ```bash
   # For frontend
   docker pull your-account.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-frontend:latest
   docker stop monorepo-poc-frontend || true
   docker rm monorepo-poc-frontend || true
   docker run -d --name monorepo-poc-frontend --restart unless-stopped -p 3000:3000 your-account.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-frontend:latest
   ```

## Monitoring and Troubleshooting

### Logs

- **GitHub Actions**: Check workflow logs in GitHub Actions tab
- **Docker Logs**: `docker logs monorepo-poc-frontend` on EC2
- **Application Logs**: Check application-specific logging

### Common Issues

1. **ECR Authentication**: Ensure IAM permissions are correct
2. **Docker Build**: Check Dockerfile and build context
3. **Port Conflicts**: Ensure ports 3000/3001 are available
4. **Network Access**: Check security groups and CORS configuration

### Health Checks

Add these endpoints to your applications:

- Frontend: `GET /api/health`
- Backend: `GET /health`

These can be used for automated health checking in production deployments.
