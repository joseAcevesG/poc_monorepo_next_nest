# Environment Configuration Guide

This guide covers all environment variables, secrets, and configuration needed for the monorepo POC.

## 📋 Overview

The monorepo uses different configuration approaches:

- **Local Development**: Environment files and Docker Compose
- **CI/CD**: GitHub Actions secrets
- **Production**: Container environment variables

## 🏠 Local Development Environment

### Frontend Environment Variables

Create `apps/frontend/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Optional: Enable detailed logging
DEBUG=1
```

**Environment Variable Descriptions:**

| Variable                  | Description               | Default                 | Required |
| ------------------------- | ------------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_API_URL`     | Backend API base URL      | `http://localhost:3001` | Yes      |
| `NODE_ENV`                | Environment mode          | `development`           | No       |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1`                     | No       |
| `DEBUG`                   | Enable debug logging      | `undefined`             | No       |

### Backend Environment Variables

Create `apps/backend/.env.local`:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Optional: Database URL (if adding database)
# DATABASE_URL=postgresql://user:password@localhost:5432/monorepo_poc

# Optional: Logging level
LOG_LEVEL=debug
```

**Environment Variable Descriptions:**

| Variable      | Description          | Default                 | Required |
| ------------- | -------------------- | ----------------------- | -------- |
| `PORT`        | Server port          | `3001`                  | No       |
| `NODE_ENV`    | Environment mode     | `development`           | No       |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | No       |
| `LOG_LEVEL`   | Logging verbosity    | `info`                  | No       |

### Docker Compose Environment

The `docker-compose.yml` file defines environment variables for containerized development:

```yaml
# Frontend service environment
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_URL=http://backend:3001

# Backend service environment
environment:
  - NODE_ENV=production
  - PORT=3001
```

## ☁️ Production Environment (AWS)

### Frontend Production Variables

Set in deployment pipeline and EC2 containers:

```bash
# Runtime Environment
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# API Configuration
NEXT_PUBLIC_API_URL=http://your-backend-ec2-ip:3001

# Optional: Performance monitoring
NEXT_TELEMETRY_DISABLED=1
```

### Backend Production Variables

Set in deployment pipeline and EC2 containers:

```bash
# Runtime Environment
NODE_ENV=production
PORT=3001

# CORS Configuration
CORS_ORIGIN=http://your-frontend-ec2-ip:3000

# Optional: Health check endpoint
HEALTH_CHECK_ENABLED=true
```

## 🔐 GitHub Actions Secrets

### Required Secrets

Configure these in GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

#### AWS Configuration

```bash
# AWS Credentials (Personal Account)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# AWS Credentials (AWS Academy - includes session token)
AWS_ACCESS_KEY_ID=ASIA...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjE...
AWS_REGION=us-east-1
```

#### ECR Configuration

```bash
# ECR Repository URIs
ECR_FRONTEND_REPOSITORY=123456789.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-frontend
ECR_BACKEND_REPOSITORY=123456789.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-backend
```

#### EC2 Configuration

```bash
# EC2 Instance Details
EC2_FRONTEND_HOST=1.2.3.4
BACKEND_EC2_IP=5.6.7.8

# SSH Private Key (entire key including headers)
EC2_FRONTEND_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...key content...
-----END RSA PRIVATE KEY-----
```

### Secret Management Best Practices

#### 1. AWS Academy Credentials

AWS Academy credentials expire every 4 hours:

```bash
# Update these secrets each lab session
AWS_ACCESS_KEY_ID=ASIA...      # Changes each session
AWS_SECRET_ACCESS_KEY=...      # Changes each session
AWS_SESSION_TOKEN=...          # Required for Academy, changes each session
```

**Automation Tip**: Create a script to update secrets:

```bash
#!/bin/bash
# update-academy-secrets.sh

# Get credentials from AWS Academy "AWS Details"
read -p "AWS Access Key ID: " ACCESS_KEY
read -s -p "AWS Secret Access Key: " SECRET_KEY
echo
read -s -p "AWS Session Token: " SESSION_TOKEN
echo

# Update GitHub secrets using GitHub CLI
gh secret set AWS_ACCESS_KEY_ID --body "$ACCESS_KEY"
gh secret set AWS_SECRET_ACCESS_KEY --body "$SECRET_KEY"
gh secret set AWS_SESSION_TOKEN --body "$SESSION_TOKEN"

echo "✅ AWS Academy secrets updated"
```

#### 2. Personal AWS Account

For personal accounts, credentials are more stable:

```bash
# These don't expire (until you rotate them)
AWS_ACCESS_KEY_ID=AKIA...      # Stable
AWS_SECRET_ACCESS_KEY=...      # Stable
# No AWS_SESSION_TOKEN needed
```

#### 3. SSH Key Management

Ensure your SSH private key is properly formatted:

```bash
# Correct format (include all lines)
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdef...
...multiple lines of key data...
...ending with...
-----END RSA PRIVATE KEY-----

# Common mistakes:
# ❌ Missing BEGIN/END lines
# ❌ Extra spaces or newlines
# ❌ Wrong key type (should match EC2 key pair)
```

## 🔧 Configuration Management

### Environment File Templates

Create template files for easy setup:

**`apps/frontend/.env.example`:**

```bash
# Copy to .env.local and fill in values
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

**`apps/backend/.env.example`:**

```bash
# Copy to .env.local and fill in values
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Configuration Validation

Add configuration validation to your applications:

**Frontend configuration validation:**

```typescript
// apps/frontend/src/lib/config.ts
const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
	nodeEnv: process.env.NODE_ENV || "development",
	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production",
};

// Validate required environment variables
if (!config.apiUrl) {
	throw new Error("NEXT_PUBLIC_API_URL is required");
}

export default config;
```

**Backend configuration validation:**

```typescript
// apps/backend/src/config/configuration.ts
export default () => ({
	port: parseInt(process.env.PORT, 10) || 3001,
	nodeEnv: process.env.NODE_ENV || "development",
	corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
	logLevel: process.env.LOG_LEVEL || "info",
});
```

## 🚀 Deployment Configuration

### Docker Environment Variables

Environment variables are set during container deployment:

**Frontend Deployment:**

```bash
# In GitHub Actions deploy step
docker run -d \
  --name frontend-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=http://${{ secrets.BACKEND_EC2_IP }}:3001 \
  $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

**Backend Deployment:**

```bash
# In GitHub Actions deploy step
docker run -d \
  --name backend-app \
  --restart unless-stopped \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e CORS_ORIGIN=http://${{ secrets.EC2_FRONTEND_HOST }}:3000 \
  $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

### Environment-Specific Configurations

#### Development

```bash
# Optimized for development experience
NODE_ENV=development
DEBUG=1
LOG_LEVEL=debug
NEXT_TELEMETRY_DISABLED=1
```

#### Production

```bash
# Optimized for performance and security
NODE_ENV=production
LOG_LEVEL=info
NEXT_TELEMETRY_DISABLED=1
```

## 🔍 Troubleshooting Configuration

### Common Configuration Issues

#### 1. CORS Errors

```bash
# Problem: Frontend can't connect to backend
# Solution: Check CORS_ORIGIN in backend matches frontend URL

# Development
CORS_ORIGIN=http://localhost:3000

# Production
CORS_ORIGIN=http://your-frontend-ec2-ip:3000
```

#### 2. API Connection Errors

```bash
# Problem: Frontend can't reach backend API
# Solution: Verify NEXT_PUBLIC_API_URL

# Development
NEXT_PUBLIC_API_URL=http://localhost:3001

# Production
NEXT_PUBLIC_API_URL=http://your-backend-ec2-ip:3001
```

#### 3. Missing Environment Variables

```bash
# Problem: Application crashes on startup
# Solution: Check required environment variables are set

# Debug: Log all environment variables
console.log('Environment:', process.env);
```

#### 4. AWS Credentials Issues

```bash
# Problem: ECR authentication fails
# Solutions:
# 1. Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
# 2. For AWS Academy: Ensure AWS_SESSION_TOKEN is included
# 3. Verify credentials haven't expired (Academy: 4 hours)
```

### Configuration Debugging

#### Check Environment Variables in Container

```bash
# SSH to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Check container environment
sudo docker exec frontend-app env
sudo docker exec backend-app env
```

#### Validate Configuration Locally

```bash
# Test environment loading
node -e "console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)"
node -e "console.log('Port:', process.env.PORT)"
```

## 📚 Configuration Reference

### Complete Environment Variable List

| Application  | Variable                | Description       | Development             | Production                |
| ------------ | ----------------------- | ----------------- | ----------------------- | ------------------------- |
| **Frontend** | `NEXT_PUBLIC_API_URL`   | Backend API URL   | `http://localhost:3001` | `http://backend-ip:3001`  |
|              | `NODE_ENV`              | Environment mode  | `development`           | `production`              |
|              | `PORT`                  | Server port       | `3000`                  | `3000`                    |
|              | `HOSTNAME`              | Bind hostname     | `localhost`             | `0.0.0.0`                 |
| **Backend**  | `PORT`                  | Server port       | `3001`                  | `3001`                    |
|              | `NODE_ENV`              | Environment mode  | `development`           | `production`              |
|              | `CORS_ORIGIN`           | Allowed origins   | `http://localhost:3000` | `http://frontend-ip:3000` |
|              | `LOG_LEVEL`             | Logging level     | `debug`                 | `info`                    |
| **AWS**      | `AWS_ACCESS_KEY_ID`     | AWS access key    | N/A                     | From IAM/Academy          |
|              | `AWS_SECRET_ACCESS_KEY` | AWS secret key    | N/A                     | From IAM/Academy          |
|              | `AWS_SESSION_TOKEN`     | AWS session token | N/A                     | Academy only              |
|              | `AWS_REGION`            | AWS region        | N/A                     | `us-east-1`               |

### Security Notes

- ✅ **Safe to commit**: Template files (`.env.example`)
- ❌ **Never commit**: Actual environment files (`.env.local`, `.env`)
- ✅ **Safe in logs**: Non-sensitive config (NODE_ENV, PORT)
- ❌ **Never log**: Secrets (AWS keys, tokens)

### Best Practices

1. **Use environment-specific files**: `.env.local`, `.env.production`
2. **Validate configuration**: Check required variables on startup
3. **Use defaults**: Provide sensible defaults for optional variables
4. **Document variables**: Maintain this guide and example files
5. **Rotate secrets**: Regularly update AWS credentials and SSH keys
6. **Monitor expiration**: Set reminders for AWS Academy credential updates
