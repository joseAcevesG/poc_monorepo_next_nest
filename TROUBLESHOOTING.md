# Troubleshooting Guide

This guide covers common issues and solutions for the monorepo POC.

## 🚨 Quick Diagnostics

### Health Check Commands

Run these commands to quickly diagnose issues:

```bash
# Check if services are running locally
curl http://localhost:3000          # Frontend
curl http://localhost:3001/hello    # Backend

# Check production services
curl http://your-frontend-ip:3000   # Frontend
curl http://your-backend-ip:3001    # Backend

# Test the complete flow
curl -X POST http://localhost:3001/hello \
  -H "Content-Type: application/json" \
  -d '{"input": "hello"}'
```

### System Status Check

```bash
# Check Node.js and pnpm versions
node --version    # Should be 22+
pnpm --version    # Should be 10+

# Check Docker status
docker --version
docker ps         # List running containers

# Check workspace dependencies
pnpm list --depth=0
```

## 🔧 Local Development Issues

### Issue: `pnpm install` Fails

**Symptoms:**

```bash
ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies
```

**Solutions:**

1. **Clear pnpm cache:**

   ```bash
   pnpm store prune
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

2. **Check Node.js version:**

   ```bash
   node --version  # Must be 22+
   nvm use 22      # If using nvm
   ```

3. **Install with legacy peer deps:**
   ```bash
   pnpm install --legacy-peer-deps
   ```

### Issue: Workspace Dependencies Not Found

**Symptoms:**

```bash
Cannot find module '@monorepo-poc/schemas'
```

**Solutions:**

1. **Rebuild workspace:**

   ```bash
   pnpm install
   turbo build
   ```

2. **Check workspace configuration:**

   ```bash
   # Verify pnpm-workspace.yaml
   cat pnpm-workspace.yaml

   # Should contain:
   packages:
     - "apps/*"
     - "packages/*"
   ```

3. **Verify package names:**
   ```bash
   # Check package.json in schemas
   cat packages/schemas/package.json | grep '"name"'
   # Should be: "@monorepo-poc/schemas"
   ```

### Issue: Turborepo Build Fails

**Symptoms:**

```bash
turbo build
× apps/frontend:build: command finished with error
```

**Solutions:**

1. **Check build dependencies:**

   ```bash
   # Build schemas first
   pnpm --filter @monorepo-poc/schemas build

   # Then build apps
   turbo build --filter=@monorepo-poc/frontend
   ```

2. **Clear Turborepo cache:**

   ```bash
   turbo clean
   rm -rf .turbo
   turbo build
   ```

3. **Check TypeScript errors:**
   ```bash
   # Run TypeScript check
   pnpm --filter @monorepo-poc/frontend tsc --noEmit
   ```

### Issue: Frontend Can't Connect to Backend

**Symptoms:**

- Network errors in browser console
- CORS errors
- Connection refused errors

**Solutions:**

1. **Check backend is running:**

   ```bash
   curl http://localhost:3001/hello
   # Should return API response
   ```

2. **Verify environment variables:**

   ```bash
   # Check frontend .env.local
   cat apps/frontend/.env.local
   # Should have: NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Check CORS configuration:**

   ```bash
   # In backend, verify CORS_ORIGIN
   cat apps/backend/.env.local
   # Should have: CORS_ORIGIN=http://localhost:3000
   ```

4. **Test API directly:**
   ```bash
   curl -X POST http://localhost:3001/hello \
     -H "Content-Type: application/json" \
     -d '{"input": "hello"}'
   ```

### Issue: Tests Failing

**Symptoms:**

```bash
pnpm test
FAIL apps/frontend/src/components/HelloForm.test.tsx
```

**Solutions:**

1. **Run tests individually:**

   ```bash
   pnpm --filter @monorepo-poc/schemas test
   pnpm --filter @monorepo-poc/frontend test
   pnpm --filter @monorepo-poc/backend test
   ```

2. **Check test environment:**

   ```bash
   # Verify Vitest configuration
   cat apps/frontend/vitest.config.ts
   cat apps/backend/vitest.config.ts
   ```

3. **Update test snapshots:**
   ```bash
   pnpm --filter @monorepo-poc/frontend test -- -u
   ```

## 🐳 Docker Issues

### Issue: Docker Build Fails

**Symptoms:**

```bash
docker build -f apps/frontend/Dockerfile .
ERROR: failed to solve: process "/bin/sh -c pnpm install" didn't complete successfully
```

**Solutions:**

1. **Check Docker context:**

   ```bash
   # Build from repository root
   cd /path/to/monorepo-poc
   docker build -f apps/frontend/Dockerfile .
   ```

2. **Clear Docker cache:**

   ```bash
   docker system prune -a
   docker build --no-cache -f apps/frontend/Dockerfile .
   ```

3. **Check Dockerfile syntax:**

   ```bash
   # Validate Dockerfile
   docker build --dry-run -f apps/frontend/Dockerfile .
   ```

4. **Test build stages:**
   ```bash
   # Build only base stage
   docker build --target base -f apps/frontend/Dockerfile .
   ```

### Issue: Container Exits Immediately

**Symptoms:**

```bash
docker ps -a
CONTAINER ID   STATUS
abc123         Exited (1) 2 seconds ago
```

**Solutions:**

1. **Check container logs:**

   ```bash
   docker logs container-name
   # Look for error messages
   ```

2. **Run container interactively:**

   ```bash
   docker run -it --entrypoint /bin/sh your-image
   # Debug inside container
   ```

3. **Check environment variables:**
   ```bash
   docker run --rm your-image env
   # Verify all required env vars are set
   ```

### Issue: Docker Compose Fails

**Symptoms:**

```bash
docker-compose up
ERROR: Service 'frontend' failed to build
```

**Solutions:**

1. **Build services individually:**

   ```bash
   docker-compose build frontend
   docker-compose build backend
   ```

2. **Check service dependencies:**

   ```bash
   # Start backend first
   docker-compose up backend
   # Then start frontend
   docker-compose up frontend
   ```

3. **Reset Docker Compose:**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

## ☁️ AWS Deployment Issues

### Issue: ECR Authentication Failed

**Symptoms:**

```bash
Error: Cannot perform an interactive login from a non TTY device
```

**Solutions:**

1. **Check AWS credentials:**

   ```bash
   # Verify credentials are set
   aws sts get-caller-identity
   ```

2. **For AWS Academy users:**

   ```bash
   # Ensure session token is included
   export AWS_SESSION_TOKEN=your-session-token
   aws ecr get-login-password --region us-east-1
   ```

3. **Manual ECR login:**
   ```bash
   aws ecr get-login-password --region us-east-1 | \
   docker login --username AWS --password-stdin \
   123456789.dkr.ecr.us-east-1.amazonaws.com
   ```

### Issue: GitHub Actions Deployment Fails

**Symptoms:**

- Workflow fails at "Deploy to EC2" step
- SSH connection errors
- Permission denied errors

**Solutions:**

1. **Check GitHub secrets:**

   ```bash
   # Verify all required secrets are set:
   # - AWS_ACCESS_KEY_ID
   # - AWS_SECRET_ACCESS_KEY
   # - AWS_SESSION_TOKEN (Academy only)
   # - EC2_FRONTEND_HOST
   # - EC2_FRONTEND_PRIVATE_KEY
   ```

2. **Validate SSH key format:**

   ```bash
   # SSH key should include headers
   -----BEGIN RSA PRIVATE KEY-----
   ...key content...
   -----END RSA PRIVATE KEY-----
   ```

3. **Test SSH connection locally:**

   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   # Should connect without errors
   ```

4. **Check EC2 security groups:**
   ```bash
   # Ensure SSH (port 22) is allowed
   aws ec2 describe-security-groups --region us-east-1
   ```

### Issue: EC2 Container Won't Start

**Symptoms:**

- Deployment succeeds but health check fails
- Container exits immediately on EC2

**Solutions:**

1. **SSH to EC2 and check logs:**

   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   sudo docker logs frontend-app
   ```

2. **Check container status:**

   ```bash
   sudo docker ps -a
   # Look for exit codes and status
   ```

3. **Verify Docker installation:**

   ```bash
   # Check Docker is running
   sudo systemctl status docker
   sudo systemctl start docker
   ```

4. **Test container locally:**
   ```bash
   # Pull and run the same image locally
   docker pull your-ecr-uri:latest
   docker run -p 3000:3000 your-ecr-uri:latest
   ```

### Issue: Health Check Fails

**Symptoms:**

```bash
❌ Health check failed after 10 attempts
```

**Solutions:**

1. **Check application startup time:**

   ```bash
   # Increase wait time in health check
   sleep 60  # Instead of 30
   ```

2. **Verify health check endpoint:**

   ```bash
   # Test endpoint directly
   curl http://your-ec2-ip:3000
   curl http://your-ec2-ip:3001/health
   ```

3. **Check security groups:**
   ```bash
   # Ensure ports 3000/3001 are open
   aws ec2 describe-security-groups --region us-east-1
   ```

## 🔐 AWS Academy Specific Issues

### Issue: Credentials Expired

**Symptoms:**

```bash
An error occurred (ExpiredToken) when calling the operation
```

**Solutions:**

1. **Update GitHub secrets:**

   ```bash
   # Get new credentials from AWS Academy "AWS Details"
   # Update these GitHub secrets:
   # - AWS_ACCESS_KEY_ID
   # - AWS_SECRET_ACCESS_KEY
   # - AWS_SESSION_TOKEN
   ```

2. **Automate credential updates:**
   ```bash
   # Use GitHub CLI to update secrets
   gh secret set AWS_ACCESS_KEY_ID --body "new-access-key"
   gh secret set AWS_SECRET_ACCESS_KEY --body "new-secret-key"
   gh secret set AWS_SESSION_TOKEN --body "new-session-token"
   ```

### Issue: Region Restrictions

**Symptoms:**

```bash
InvalidUserID.NotFound: The user ID 'AIDACKCEVSQ6C2EXAMPLE' does not exist
```

**Solutions:**

1. **Use supported regions:**

   ```bash
   # AWS Academy only supports:
   # - us-east-1
   # - us-west-2
   ```

2. **Update all configurations:**

   ```bash
   # Update GitHub secrets
   AWS_REGION=us-east-1

   # Update ECR repository URIs
   ECR_FRONTEND_REPOSITORY=123456789.dkr.ecr.us-east-1.amazonaws.com/...
   ```

### Issue: Resource Limits

**Symptoms:**

- Cannot create large EC2 instances
- EBS volume size limits
- Credit exhaustion

**Solutions:**

1. **Use smaller instances:**

   ```bash
   # Use t3.micro or t2.micro instead of larger instances
   # These are within Academy limits
   ```

2. **Monitor credits:**
   ```bash
   # Check remaining credits in AWS Academy
   # Clean up unused resources regularly
   ```

## 🔍 Debugging Techniques

### Enable Debug Logging

**Frontend debugging:**

```bash
# Add to .env.local
DEBUG=1
NEXT_PUBLIC_DEBUG=true

# Check browser console for detailed logs
```

**Backend debugging:**

```bash
# Add to .env.local
LOG_LEVEL=debug
DEBUG=*

# Check server logs for detailed output
```

### Network Debugging

**Check port connectivity:**

```bash
# Test if ports are accessible
telnet localhost 3000
telnet localhost 3001

# For production
telnet your-ec2-ip 3000
telnet your-ec2-ip 3001
```

**Check DNS resolution:**

```bash
# Verify hostnames resolve
nslookup your-ec2-hostname
ping your-ec2-ip
```

### Container Debugging

**Inspect running containers:**

```bash
# Check container details
docker inspect container-name

# Check resource usage
docker stats container-name

# Execute commands in container
docker exec -it container-name /bin/sh
```

**Debug container networking:**

```bash
# Check container networks
docker network ls
docker network inspect bridge

# Test connectivity between containers
docker exec frontend-container ping backend-container
```

## 📊 Performance Issues

### Issue: Slow Build Times

**Solutions:**

1. **Use Turborepo caching:**

   ```bash
   # Enable remote caching (if available)
   turbo build --cache-dir=.turbo
   ```

2. **Optimize Docker builds:**

   ```bash
   # Use BuildKit for faster builds
   DOCKER_BUILDKIT=1 docker build -f apps/frontend/Dockerfile .
   ```

3. **Parallel builds:**
   ```bash
   # Build packages in parallel
   turbo build --parallel
   ```

### Issue: High Memory Usage

**Solutions:**

1. **Limit Node.js memory:**

   ```bash
   # Add to package.json scripts
   "dev": "NODE_OPTIONS='--max-old-space-size=4096' turbo dev"
   ```

2. **Optimize Docker images:**

   ```bash
   # Use Alpine images
   FROM node:22-alpine

   # Multi-stage builds to reduce size
   ```

## 🆘 Emergency Procedures

### Complete Reset

If everything is broken, try this complete reset:

```bash
# 1. Clean all caches
pnpm store prune
rm -rf node_modules
rm -rf .turbo
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# 2. Clean Docker
docker system prune -a
docker volume prune

# 3. Reinstall everything
pnpm install
turbo build

# 4. Test locally
pnpm dev
```

### Rollback Deployment

If production deployment is broken:

```bash
# 1. SSH to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# 2. Stop current container
sudo docker stop frontend-app
sudo docker rm frontend-app

# 3. Run previous version
sudo docker run -d \
  --name frontend-app \
  --restart unless-stopped \
  -p 3000:3000 \
  your-ecr-uri:previous-working-tag
```

## 📞 Getting Help

### Information to Gather

When seeking help, provide:

1. **Error messages** (full stack traces)
2. **Environment details** (Node.js version, OS, etc.)
3. **Steps to reproduce** the issue
4. **Recent changes** made to the codebase
5. **Logs** from relevant services

### Useful Commands for Diagnostics

```bash
# System information
node --version
pnpm --version
docker --version
uname -a

# Project status
pnpm list --depth=0
turbo build --dry-run
docker ps -a

# Logs
docker logs container-name
journalctl -u docker
tail -f /var/log/messages
```

### Log Locations

- **Local development**: Console output
- **Docker containers**: `docker logs container-name`
- **EC2 instances**: `/var/log/messages`, `journalctl`
- **GitHub Actions**: Workflow run logs in GitHub UI

Remember: Most issues can be resolved by carefully reading error messages and checking configuration. When in doubt, start with the basics: ensure all dependencies are installed, environment variables are set correctly, and services can communicate with each other.
