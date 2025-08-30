#!/bin/bash

# AWS Academy Lab Infrastructure Verification Script
# This script helps verify that the AWS infrastructure has been set up correctly in AWS Academy

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

# Check if region is Academy-supported
if [[ "$REGION" != "us-east-1" && "$REGION" != "us-west-2" ]]; then
    echo "⚠️  WARNING: Region $REGION is not supported by AWS Academy"
    echo "   Supported regions: us-east-1, us-west-2"
fi
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

# Check for Academy lab roles
echo "🔐 Checking available IAM roles..."

# Look for Academy default roles
if aws iam list-roles --query 'Roles[?contains(RoleName, `Lab`) || contains(RoleName, `EC2`)].{Name:RoleName,Arn:Arn}' --output table &> /dev/null; then
    echo "📋 Available Academy lab roles:"
    aws iam list-roles --query 'Roles[?contains(RoleName, `Lab`) || contains(RoleName, `EC2`)].{Name:RoleName,Arn:Arn}' --output table
else
    echo "ℹ️  No specific lab roles found - using default Academy permissions"
fi

# Skip custom role check for Academy
echo "ℹ️  Skipping custom IAM role creation (not available in Academy labs)"

echo ""

# Verify Academy Lab Credentials
echo "👤 Checking Academy lab credentials..."

# Check if we're using Academy lab credentials by looking for specific patterns
CALLER_INFO=$(aws sts get-caller-identity --output json)
USER_ARN=$(echo "$CALLER_INFO" | jq -r '.Arn // empty')

if [[ "$USER_ARN" == *"voclabs"* ]] || [[ "$USER_ARN" == *"vocstudent"* ]] || [[ "$USER_ARN" == *"academy"* ]]; then
    echo "✅ Using AWS Academy lab credentials"
    echo "   User ARN: $USER_ARN"
    echo "   💡 These are temporary credentials - refresh every 4 hours"
else
    echo "⚠️  Not using Academy lab credentials"
    echo "   Current ARN: $USER_ARN"
    echo "   💡 For Academy labs, use credentials from 'AWS Details' button"
fi

# Check IAM permissions for ECR
echo "🔍 Testing ECR permissions..."
if aws ecr describe-repositories --max-items 1 &> /dev/null; then
    echo "✅ ECR read permissions available"
else
    echo "❌ ECR read permissions denied"
fi

# Skip custom IAM user check for Academy
echo "ℹ️  Skipping custom IAM user check (not available in Academy labs)"

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
echo "IAM: Using Academy lab default permissions"
echo ""
echo "🔐 GitHub Actions Secrets to configure:"
echo "======================================="
echo "📝 Get these from AWS Academy 'AWS Details' button:"
echo "AWS_ACCESS_KEY_ID: (from Academy lab credentials)"
echo "AWS_SECRET_ACCESS_KEY: (from Academy lab credentials)"
echo "AWS_SESSION_TOKEN: (from Academy lab credentials - required!)"
echo "AWS_REGION: $REGION"
echo "ECR_FRONTEND_REPOSITORY: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$FRONTEND_REPO"
echo "ECR_BACKEND_REPOSITORY: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$BACKEND_REPO"
echo ""
echo "⏰ Remember: Academy credentials expire every 4 hours!"