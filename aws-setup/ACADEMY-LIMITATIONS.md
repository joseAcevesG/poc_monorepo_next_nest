# AWS Academy Learner Lab Limitations

## What You CAN Do:
- ✅ Create ECR repositories (Docker image storage)
- ✅ Create basic IAM roles for EC2
- ✅ Deploy Docker containers to EC2
- ✅ Use S3, Lambda, API Gateway
- ✅ Set up basic networking (VPC, subnets)
- ✅ Use CloudWatch for monitoring

## What You CANNOT Do:
- ❌ Use regions other than `us-east-1` or `us-west-2`
- ❌ Create IAM users with PowerUser permissions (limited IAM)
- ❌ Run EC2 instances larger than "large" 
- ❌ Use more than 32 vCPUs concurrently
- ❌ Create EBS volumes larger than 100GB
- ❌ Use custom AMIs (Amazon Linux/Windows only)
- ❌ Work beyond 4-hour session timeout
- ❌ Exceed $100 credit budget

## Workarounds for Your Setup:

### IAM User Creation
Since you likely can't create PowerUser IAM users:
1. Use the temporary lab credentials from "AWS Details" in Academy
2. These credentials rotate but work for GitHub Actions during lab sessions

### GitHub Actions Strategy
- Set up GitHub Actions to use Academy lab credentials
- Ensure deployments complete within 4-hour session window
- Consider using GitHub Actions secrets that you update each lab session

### Cost Management
- Use lifecycle policies aggressively (keep only 5 images instead of 10)
- Use smaller EC2 instances (micro/small)
- Clean up resources after each lab session

## Recommended Region
Use `us-east-1` (default) since it has the most Academy support.