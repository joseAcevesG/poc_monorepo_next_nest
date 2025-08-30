# AWS Infrastructure Setup Guide

This guide walks you through setting up the required AWS infrastructure for the monorepo-poc deployment.

## Prerequisites

- AWS Account with appropriate permissions
- Access to AWS Console
- AWS CLI installed (optional, for verification)

## Step 1: Create ECR Repositories

### 1.1 Navigate to Amazon ECR

1. Log into AWS Console
2. Navigate to **Amazon ECR** service
3. Ensure you're in your desired AWS region

### 1.2 Create Frontend Repository

1. Click **"Create repository"**
2. Set **Repository name**: `monorepo-poc-frontend`
3. Keep **Visibility settings** as **Private**
4. Leave other settings as default
5. Click **"Create repository"**
6. **Note down the Repository URI** (format: `{account-id}.dkr.ecr.{region}.amazonaws.com/monorepo-poc-frontend`)

### 1.3 Create Backend Repository

1. Click **"Create repository"**
2. Set **Repository name**: `monorepo-poc-backend`
3. Keep **Visibility settings** as **Private**
4. Leave other settings as default
5. Click **"Create repository"**
6. **Note down the Repository URI** (format: `{account-id}.dkr.ecr.{region}.amazonaws.com/monorepo-poc-backend`)

## Step 2: Configure Repository Lifecycle Policies

### 2.1 Frontend Repository Lifecycle Policy

1. Select the **monorepo-poc-frontend** repository
2. Go to **"Lifecycle policy"** tab
3. Click **"Create rule"**
4. Configure the rule:
   - **Rule priority**: 1
   - **Rule description**: Keep last 10 images
   - **Image status**: Any
   - **Match criteria**: Since image pushed
   - **Count type**: Image count more than
   - **Count number**: 10
5. Click **"Save"**

### 2.2 Backend Repository Lifecycle Policy

1. Select the **monorepo-poc-backend** repository
2. Go to **"Lifecycle policy"** tab
3. Click **"Create rule"**
4. Configure the rule:
   - **Rule priority**: 1
   - **Rule description**: Keep last 10 images
   - **Image status**: Any
   - **Match criteria**: Since image pushed
   - **Count type**: Image count more than
   - **Count number**: 10
5. Click **"Save"**

## Step 3: Create IAM Role for EC2 Instances

### 3.1 Navigate to IAM

1. Navigate to **IAM** service in AWS Console
2. Click **"Roles"** in the left sidebar

### 3.2 Create EC2 Role

1. Click **"Create role"**
2. Select **"AWS service"** as trusted entity type
3. Select **"EC2"** as the service
4. Click **"Next"**
5. Search for and select **"AmazonEC2ContainerRegistryReadOnly"** policy
6. Click **"Next"**
7. Set **Role name**: `ECR-EC2-Role`
8. Set **Description**: `Role for EC2 instances to pull images from ECR`
9. Click **"Create role"**
10. **Note down the Role ARN** (format: `arn:aws:iam::{account-id}:role/ECR-EC2-Role`)

## Step 4: Create IAM User for GitHub Actions

### 4.1 Create IAM User

1. In IAM console, click **"Users"** in the left sidebar
2. Click **"Create user"**
3. Set **User name**: `github-actions-ecr`
4. Click **"Next"**
5. Select **"Attach policies directly"**
6. Search for and select **"AmazonEC2ContainerRegistryPowerUser"** policy
7. Click **"Next"**
8. Review and click **"Create user"**

### 4.2 Generate Access Keys

1. Click on the newly created **github-actions-ecr** user
2. Go to **"Security credentials"** tab
3. Click **"Create access key"**
4. Select **"Application running outside AWS"**
5. Click **"Next"**
6. Set **Description tag**: `GitHub Actions ECR access`
7. Click **"Create access key"**
8. **IMPORTANT**: Copy and securely store:
   - **Access key ID**
   - **Secret access key**
9. Click **"Done"**

## Step 5: Document Configuration

After completing all steps, create `aws-setup/config.json` with your actual values:

```json
{
	"ecr": {
		"region": "your-aws-region",
		"repositories": {
			"frontend": {
				"name": "monorepo-poc-frontend",
				"uri": "your-account-id.dkr.ecr.your-region.amazonaws.com/monorepo-poc-frontend"
			},
			"backend": {
				"name": "monorepo-poc-backend",
				"uri": "your-account-id.dkr.ecr.your-region.amazonaws.com/monorepo-poc-backend"
			}
		}
	},
	"iam": {
		"ec2Role": {
			"name": "ECR-EC2-Role",
			"arn": "arn:aws:iam::your-account-id:role/ECR-EC2-Role"
		},
		"githubActionsUser": {
			"name": "github-actions-ecr",
			"note": "Access keys stored securely in GitHub Actions secrets"
		}
	}
}
```

**Security Note**: ECR URIs, AWS region, and IAM role ARNs are safe to commit to your repository. Only the AWS access keys should be kept secret in GitHub Actions secrets.

## GitHub Actions Secrets

Add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: The access key ID from Step 4.2
   - `AWS_SECRET_ACCESS_KEY`: The secret access key from Step 4.2
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `ECR_FRONTEND_REPOSITORY`: Frontend repository URI
   - `ECR_BACKEND_REPOSITORY`: Backend repository URI

## Verification

You can verify your setup using the AWS CLI:

```bash
# Verify ECR repositories
aws ecr describe-repositories --repository-names monorepo-poc-frontend monorepo-poc-backend

# Verify IAM role
aws iam get-role --role-name ECR-EC2-Role

# Test ECR authentication
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
```

## Next Steps

Once this infrastructure is set up, you can proceed with:

- Task 10: Implement frontend CI/CD pipeline
- Task 11: Implement backend CI/CD pipeline
- Task 12: Configure EC2 instances for Docker deployment
