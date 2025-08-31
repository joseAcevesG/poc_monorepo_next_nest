# Deployment Guide

This guide provides detailed instructions for deploying the monorepo POC to AWS infrastructure.

## 📋 Prerequisites

Before starting deployment, ensure you have:

- ✅ AWS account (personal or AWS Academy access)
- ✅ GitHub repository with the monorepo code
- ✅ Docker installed locally (for testing)
- ✅ AWS CLI installed (optional, for verification)

## 🏗️ Infrastructure Setup

### Step 1: AWS Infrastructure

Choose your setup method:

- **AWS Academy Users**: Follow [aws-setup/README.md](./aws-setup/README.md)
- **Personal AWS Account**: Follow [aws-setup/PERSONAL-ACCOUNT-SETUP.md](./aws-setup/PERSONAL-ACCOUNT-SETUP.md)

This will create:

- ECR repositories for Docker images
- IAM roles and users for deployment
- EC2 instances for hosting applications

### Step 2: EC2 Instance Configuration

#### Frontend EC2 Instance

1. **Launch EC2 Instance**

   ```bash
   # Instance specifications
   - AMI: Amazon Linux 2023
   - Instance Type: t3.micro (or t2.micro for free tier)
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22), Custom (3000)
   - Key Pair: Create or use existing key pair
   ```

2. **Install Docker and Dependencies**

   ```bash
   # SSH into the instance
   ssh -i your-key.pem ec2-user@your-frontend-ip

   # Update system
   sudo yum update -y

   # Install Docker
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user

   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   rm -rf awscliv2.zip aws/

   # Logout and login again for Docker group to take effect
   exit
   ```

3. **Configure IAM Role (Personal AWS)**
   ```bash
   # Attach the ECR-EC2-Role to the instance
   # This can be done through AWS Console:
   # EC2 → Instances → Select Instance → Actions → Security → Modify IAM role
   ```

#### Backend EC2 Instance

Follow the same steps as frontend, but with different security group:

- Security Group: Allow SSH (22), Custom (3001), and access from frontend instance

### Step 3: GitHub Actions Configuration

#### Required Secrets

Add these secrets to your GitHub repository (`Settings` → `Secrets and variables` → `Actions`):

**AWS Credentials:**

```bash
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_SESSION_TOKEN=your-session-token  # Required for AWS Academy
AWS_REGION=us-east-1
```

**ECR Repositories:**

```bash
ECR_FRONTEND_REPOSITORY=123456789.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-frontend
ECR_BACKEND_REPOSITORY=123456789.dkr.ecr.us-east-1.amazonaws.com/monorepo-poc-backend
```

**EC2 Configuration:**

```bash
EC2_FRONTEND_HOST=1.2.3.4  # Frontend EC2 public IP
BACKEND_EC2_IP=5.6.7.8     # Backend EC2 public IP
EC2_FRONTEND_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
...your private key content...
-----END RSA PRIVATE KEY-----
```

#### Secrets Configuration Guide

1. **Get AWS Credentials**

   - **Personal AWS**: From IAM user created in setup
   - **AWS Academy**: From "AWS Details" button in lab environment

2. **Get ECR Repository URIs**

   ```bash
   # List ECR repositories
   aws ecr describe-repositories --region us-east-1
   ```

3. **Get EC2 IP Addresses**

   ```bash
   # List EC2 instances
   aws ec2 describe-instances --region us-east-1 --query 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,State.Name]'
   ```

4. **Prepare SSH Private Key**
   ```bash
   # Copy your EC2 key pair private key content
   cat your-key.pem
   # Copy the entire content including BEGIN/END lines
   ```

## 🚀 Deployment Process

### Automatic Deployment

Deployments trigger automatically on push to `main` branch:

- **Frontend Pipeline**: Triggers on changes to `apps/frontend/` or `packages/schemas/`
- **Backend Pipeline**: Triggers on changes to `apps/backend/` or `packages/schemas/`

### Manual Deployment

Using GitHub CLI:

```bash
# Deploy frontend
gh workflow run deploy-frontend.yml

# Deploy backend
gh workflow run deploy-backend.yml
```

Using GitHub Web Interface:

1. Go to `Actions` tab in your repository
2. Select the workflow you want to run
3. Click `Run workflow`

### Deployment Steps (Automated)

Each deployment pipeline performs these steps:

1. **Build Phase**

   - Checkout code
   - Setup Node.js 22 and pnpm
   - Install dependencies with caching
   - Build affected packages using Turborepo
   - Run tests for affected packages

2. **Docker Phase**

   - Configure AWS credentials
   - Login to Amazon ECR
   - Build Docker image with multi-stage build
   - Push image to ECR with commit SHA and latest tags

3. **Deploy Phase**

   - Create deployment script
   - Copy script to EC2 instance via SSH
   - Execute deployment on EC2:
     - Install Docker and AWS CLI if needed
     - Login to ECR
     - Pull latest Docker image
     - Stop existing container
     - Start new container with updated image
     - Clean up old images

4. **Verification Phase**
   - Wait for application to start
   - Perform health checks
   - Report deployment status

## 🔍 Monitoring Deployment

### GitHub Actions Logs

Monitor deployment progress:

1. Go to `Actions` tab in GitHub
2. Click on the running workflow
3. Expand each step to see detailed logs

### EC2 Application Logs

SSH into EC2 instances to check application logs:

```bash
# Frontend logs
ssh -i your-key.pem ec2-user@frontend-ip
sudo docker logs frontend-app -f

# Backend logs
ssh -i your-key.pem ec2-user@backend-ip
sudo docker logs backend-app -f
```

### Health Checks

**Frontend Health Check:**

```bash
curl http://your-frontend-ip:3000
```

**Backend Health Check:**

```bash
curl http://your-backend-ip:3001/health
```

**End-to-End Test:**

```bash
# Test the hello -> world flow
curl -X POST http://your-backend-ip:3001/hello \
  -H "Content-Type: application/json" \
  -d '{"input": "hello"}'
```

## 🛠️ Troubleshooting Deployment

### Common Issues

#### 1. ECR Authentication Failed

```bash
# Error: Unable to locate credentials
# Solution: Check AWS credentials in GitHub secrets
# For AWS Academy: Ensure AWS_SESSION_TOKEN is included
```

#### 2. Docker Build Failed

```bash
# Error: Package not found during build
# Solution: Ensure all workspace dependencies are properly configured
# Check pnpm-workspace.yaml and package.json files
```

#### 3. EC2 Connection Failed

```bash
# Error: Permission denied (publickey)
# Solution:
# 1. Check EC2_FRONTEND_PRIVATE_KEY secret format
# 2. Ensure private key matches the EC2 key pair
# 3. Verify EC2 security group allows SSH (port 22)
```

#### 4. Container Start Failed

```bash
# Error: Container exits immediately
# Solution: Check container logs on EC2
ssh -i your-key.pem ec2-user@your-ec2-ip
sudo docker logs container-name
```

#### 5. Health Check Failed

```bash
# Error: Application not responding
# Solution:
# 1. Check if container is running: docker ps
# 2. Check application logs: docker logs container-name
# 3. Verify port mapping and security groups
```

### Debug Commands

**Check Docker Status on EC2:**

```bash
# List running containers
sudo docker ps

# List all containers
sudo docker ps -a

# Check container logs
sudo docker logs container-name

# Check container resource usage
sudo docker stats
```

**Check Network Connectivity:**

```bash
# Test port connectivity
telnet your-ec2-ip 3000  # Frontend
telnet your-ec2-ip 3001  # Backend

# Check security groups
aws ec2 describe-security-groups --region us-east-1
```

**Check ECR Images:**

```bash
# List images in repository
aws ecr list-images --repository-name monorepo-poc-frontend --region us-east-1
aws ecr list-images --repository-name monorepo-poc-backend --region us-east-1
```

## 🔄 Rollback Procedures

### Rollback to Previous Version

If a deployment fails, you can rollback to a previous version:

1. **Find Previous Image Tag**

   ```bash
   # List recent images
   aws ecr describe-images --repository-name monorepo-poc-frontend --region us-east-1 \
     --query 'sort_by(imageDetails,& imagePushedAt)[-5:]'
   ```

2. **Deploy Previous Version**

   ```bash
   # SSH to EC2 instance
   ssh -i your-key.pem ec2-user@your-ec2-ip

   # Stop current container
   sudo docker stop frontend-app
   sudo docker rm frontend-app

   # Run previous version
   sudo docker run -d \
     --name frontend-app \
     --restart unless-stopped \
     -p 3000:3000 \
     -e NODE_ENV=production \
     your-ecr-uri:previous-commit-sha
   ```

### Emergency Rollback

For critical issues, you can quickly rollback using the `latest` tag from before the problematic deployment:

```bash
# This assumes the previous 'latest' tag was working
sudo docker pull your-ecr-uri:latest
sudo docker stop frontend-app
sudo docker rm frontend-app
sudo docker run -d --name frontend-app --restart unless-stopped -p 3000:3000 your-ecr-uri:latest
```

## 📊 Performance Optimization

### Build Optimization

- **Turborepo Caching**: Builds only changed packages
- **Docker Layer Caching**: Reuses unchanged layers
- **pnpm Caching**: Efficient dependency installation

### Runtime Optimization

- **Multi-stage Builds**: Minimal production images
- **Non-root Users**: Security best practices
- **Resource Limits**: Prevent resource exhaustion

### Monitoring

Set up basic monitoring:

```bash
# Create monitoring script
cat > /home/ec2-user/monitor.sh << 'EOF'
#!/bin/bash
echo "=== Container Status ==="
sudo docker ps
echo "=== Resource Usage ==="
sudo docker stats --no-stream
echo "=== Disk Usage ==="
df -h
EOF

chmod +x /home/ec2-user/monitor.sh

# Run monitoring
./monitor.sh
```

## 🔐 Security Considerations

### Secrets Management

- Never commit AWS credentials to repository
- Use GitHub Actions secrets for sensitive data
- Rotate credentials regularly (especially AWS Academy)

### Network Security

- Configure security groups with minimal required access
- Use HTTPS in production (consider adding load balancer)
- Regularly update EC2 instances and Docker images

### Container Security

- Run containers as non-root users
- Use official base images (Node.js Alpine)
- Regularly update dependencies

## 📈 Scaling Considerations

For production use, consider:

- **Load Balancers**: Distribute traffic across multiple instances
- **Auto Scaling Groups**: Automatically scale based on demand
- **Container Orchestration**: Use ECS or EKS for better container management
- **Database**: Add persistent storage for data
- **CDN**: Use CloudFront for static asset delivery
- **Monitoring**: Implement comprehensive logging and monitoring

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring and alerting**
2. **Implement HTTPS with SSL certificates**
3. **Add database persistence if needed**
4. **Configure custom domain names**
5. **Set up backup and disaster recovery**
6. **Implement comprehensive logging**
7. **Add performance monitoring**

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review GitHub Actions logs
3. Check EC2 instance logs
4. Verify AWS resource configuration
5. Test locally with Docker Compose first
