#!/bin/bash

# AWS Infrastructure Verification Script
# This script helps verify that the AWS infrastructure has been set up correctly

set -e

echo "🔍 Verifying AWS Infrastructure Setup..."
echo "========================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it to run verification."
    exit 1
fi

# Check AWS credentials
echo "📋 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

echo "✅ AWS credentials configured"
echo "   Account ID: $ACCOUNT_ID"
echo "   Region: $REGION"
echo ""

# Verify ECR repositories
echo "🐳 Checking ECR repositories..."

FRONTEND_REPO="monorepo-poc-frontend"
BACKEND_REPO="monorepo-poc-backend"

if aws ecr describe-repositories --repository-names $FRONTEND_REPO &> /dev/null; then
    echo "✅ Frontend repository exists: $FRONTEND_REPO"
    FRONTEND_URI=$(aws ecr describe-repositories --repository-names $FRONTEND_REPO --query 'repositories[0].repositoryUri' --output text)
    echo "   URI: $FRONTEND_URI"
else
    echo "❌ Frontend repository not found: $FRONTEND_REPO"
fi

if aws ecr describe-repositories --repository-names $BACKEND_REPO &> /dev/null; then
    echo "✅ Backend repository exists: $BACKEND_REPO"
    BACKEND_URI=$(aws ecr describe-repositories --repository-names $BACKEND_REPO --query 'repositories[0].repositoryUri' --output text)
    echo "   URI: $BACKEND_URI"
else
    echo "❌ Backend repository not found: $BACKEND_REPO"
fi

echo ""

# Verify IAM role
echo "🔐 Checking IAM role..."

ROLE_NAME="ECR-EC2-Role"

if aws iam get-role --role-name $ROLE_NAME &> /dev/null; then
    echo "✅ IAM role exists: $ROLE_NAME"
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    echo "   ARN: $ROLE_ARN"
    
    # Check attached policies
    POLICIES=$(aws iam list-attached-role-policies --role-name $ROLE_NAME --query 'AttachedPolicies[].PolicyName' --output text)
    echo "   Attached policies: $POLICIES"
else
    echo "❌ IAM role not found: $ROLE_NAME"
fi

echo ""

# Verify IAM user
echo "👤 Checking IAM user..."

USER_NAME="github-actions-ecr"

if aws iam get-user --user-name $USER_NAME &> /dev/null; then
    echo "✅ IAM user exists: $USER_NAME"
    
    # Check attached policies
    POLICIES=$(aws iam list-attached-user-policies --user-name $USER_NAME --query 'AttachedPolicies[].PolicyName' --output text)
    echo "   Attached policies: $POLICIES"
    
    # Check access keys
    ACCESS_KEYS=$(aws iam list-access-keys --user-name $USER_NAME --query 'AccessKeyMetadata[].AccessKeyId' --output text)
    if [ -n "$ACCESS_KEYS" ]; then
        echo "   Access keys: $ACCESS_KEYS"
    else
        echo "   ⚠️  No access keys found"
    fi
else
    echo "❌ IAM user not found: $USER_NAME"
fi

echo ""

# Test ECR authentication
echo "🔑 Testing ECR authentication..."

if aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com &> /dev/null; then
    echo "✅ ECR authentication successful"
else
    echo "❌ ECR authentication failed"
fi

echo ""
echo "🎉 Verification complete!"
echo ""
echo "📝 Configuration Summary:"
echo "========================"
echo "AWS Account ID: $ACCOUNT_ID"
echo "AWS Region: $REGION"
echo "Frontend ECR URI: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$FRONTEND_REPO"
echo "Backend ECR URI: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$BACKEND_REPO"
echo "IAM Role ARN: arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"
echo ""
echo "🔐 GitHub Actions Secrets to configure:"
echo "======================================="
echo "AWS_ACCESS_KEY_ID: (from IAM user access key)"
echo "AWS_SECRET_ACCESS_KEY: (from IAM user secret key)"
echo "AWS_REGION: $REGION"
echo "ECR_FRONTEND_REPOSITORY: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$FRONTEND_REPO"
echo "ECR_BACKEND_REPOSITORY: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$BACKEND_REPO"