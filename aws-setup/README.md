# AWS Infrastructure Setup Guide (AWS Academy Lab)

This guide walks you through setting up the required AWS infrastructure for the monorepo-poc deployment using AWS Academy Learner Lab.

## AWS Academy Learner Lab Limitations

⚠️ **Important Academy Restrictions:**
- **Regions**: Only `us-east-1` and `us-west-2` supported
- **Session Time**: 4-hour automatic timeout and shutdown
- **EC2**: Only nano/micro/small/medium/large instances, max 32 vCPU
- **Storage**: EBS volumes limited to 100GB (gp2/gp3/sc1/standard only)
- **IAM**: Limited permissions for user creation
- **Credits**: $100 total budget

## Prerequisites

- AWS Academy Learner Lab access
- Lab session started (4-hour limit)
- Region set to `us-east-1` or `us-west-2`
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

## Step 3: IAM Role for EC2 Instances (Academy Limited)

⚠️ **Academy Limitation**: You cannot create custom IAM roles in Academy labs.

### Use Default Lab Role

Academy labs provide a default EC2 instance role that includes ECR access:
1. When launching EC2 instances, look for pre-existing IAM roles
2. Use **"LabInstanceProfile"** or similar default role if available
3. If no default role exists, EC2 instances will use the lab's base permissions

**Note**: You may need to configure EC2 instances to use Docker authentication with Academy credentials instead of IAM roles.

## Step 4: Get Academy Lab Credentials for GitHub Actions

⚠️ **Academy Limitation**: You cannot create IAM users in Academy labs.

### Use Academy Lab Credentials

1. In AWS Academy, go to your lab environment
2. Click **"AWS Details"** button
3. Copy the following credentials for GitHub Actions:
   - **AWS CLI** section shows:
     - `aws_access_key_id`
     - `aws_secret_access_key` 
     - `aws_session_token`
   - **Region**: Use the lab's region (usually `us-east-1`)

**Important Notes:**
- These credentials expire every 4 hours when lab session ends
- You'll need to update GitHub Actions secrets each lab session
- Always include the `aws_session_token` - it's required for Academy labs

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
		"academyCredentials": {
			"note": "Use credentials from AWS Academy 'AWS Details' button",
			"expiration": "4 hours per lab session",
			"requiredSecrets": ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN"]
		},
		"ec2Role": {
			"note": "Use Academy default lab role (LabInstanceProfile or similar)",
			"limitation": "Cannot create custom IAM roles in Academy"
		}
	}
}
```

**Security Note**: ECR URIs, AWS region, and IAM role ARNs are safe to commit to your repository. Only the AWS access keys should be kept secret in GitHub Actions secrets.

## GitHub Actions Secrets

Add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets (from AWS Academy "AWS Details"):
   - `AWS_ACCESS_KEY_ID`: From Academy lab credentials
   - `AWS_SECRET_ACCESS_KEY`: From Academy lab credentials
   - `AWS_SESSION_TOKEN`: From Academy lab credentials (**Required for Academy**)
   - `AWS_REGION`: Your lab region (usually `us-east-1`)
   - `ECR_FRONTEND_REPOSITORY`: Frontend repository URI
   - `ECR_BACKEND_REPOSITORY`: Backend repository URI

⏰ **Remember**: Update these secrets every lab session (4-hour expiration)

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
