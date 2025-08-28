# Product Overview

## Monorepo POC - Full-Stack Validation Demo

This is a proof-of-concept monorepo demonstrating modern full-stack development patterns with shared validation logic. The application implements a simple "hello world" validation flow where users input "hello" and receive "world" as a response.

### Core Purpose

- Demonstrate monorepo architecture with shared packages
- Show consistent validation across frontend and backend
- Prove independent deployment strategies for microservices
- Keep implementation minimal and focused for POC goals

### Key Features

- **Shared Validation**: Zod schemas used consistently across frontend and backend
- **Simple Flow**: User inputs "hello" → system validates → returns "world"
- **Independent Deployment**: Separate CI/CD pipelines for frontend and backend
- **Containerized**: Docker-based deployment to EC2 instances

### Success Criteria

- Both frontend and backend use identical validation logic
- Changes to shared schemas automatically propagate to both applications
- Each service can be deployed independently without affecting the other
- System demonstrates clear separation of concerns while maintaining consistency
