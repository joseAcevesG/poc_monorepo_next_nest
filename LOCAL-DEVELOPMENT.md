# Local Development Workflow

This guide covers the complete local development workflow for the monorepo POC.

## 🚀 Quick Start

### First Time Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd monorepo-poc
   pnpm install
   ```

2. **Set up environment files:**

   ```bash
   # Frontend environment
   cp apps/frontend/.env.example apps/frontend/.env.local

   # Backend environment
   cp apps/backend/.env.example apps/backend/.env.local
   ```

3. **Build shared packages:**

   ```bash
   turbo build
   ```

4. **Start development servers:**

   ```bash
   pnpm dev
   ```

5. **Test the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Test endpoint: http://localhost:3001/hello

## 🔄 Daily Development Workflow

### Starting Development

```bash
# Start all services
pnpm dev

# Or start individual services
pnpm --filter @monorepo-poc/frontend dev    # Frontend only
pnpm --filter @monorepo-poc/backend dev     # Backend only
```

### Making Changes

#### 1. Working with Shared Schemas

When modifying validation schemas:

```bash
# 1. Edit schema files
vim packages/schemas/src/hello.schema.ts

# 2. Rebuild schemas package
pnpm --filter @monorepo-poc/schemas build

# 3. Both frontend and backend will automatically pick up changes
# (if dev servers are running with hot reload)
```

#### 2. Frontend Development

```bash
# Start frontend development
pnpm --filter @monorepo-poc/frontend dev

# Run frontend tests
pnpm --filter @monorepo-poc/frontend test

# Run frontend tests in watch mode
pnpm --filter @monorepo-poc/frontend test --watch

# Build frontend for production testing
pnpm --filter @monorepo-poc/frontend build
```

**Frontend file structure:**

```
apps/frontend/src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes (optional)
├── components/            # React components
│   └── HelloForm.tsx      # Main form component
└── lib/                   # Utilities
    ├── api-client.ts      # API client
    └── validation.ts      # Client-side validation
```

#### 3. Backend Development

```bash
# Start backend development
pnpm --filter @monorepo-poc/backend dev

# Run backend tests
pnpm --filter @monorepo-poc/backend test

# Run backend tests in watch mode
pnpm --filter @monorepo-poc/backend test --watch

# Build backend for production testing
pnpm --filter @monorepo-poc/backend build
```

**Backend file structure:**

```
apps/backend/src/
├── controllers/           # API controllers
│   └── hello.controller.ts
├── services/             # Business logic
│   └── hello.service.ts
├── dto/                  # Data transfer objects
├── pipes/                # Validation pipes
│   └── zod-validation.pipe.ts
└── main.ts               # Application entry point
```

### Testing Changes

#### Run All Tests

```bash
# Run all tests across the monorepo
pnpm test

# Run tests with coverage
pnpm test -- --coverage
```

#### Run Specific Tests

```bash
# Schema tests
pnpm --filter @monorepo-poc/schemas test

# Frontend component tests
pnpm --filter @monorepo-poc/frontend test

# Backend API tests
pnpm --filter @monorepo-poc/backend test
```

#### Manual Testing

```bash
# Test the complete flow
curl -X POST http://localhost:3001/hello \
  -H "Content-Type: application/json" \
  -d '{"input": "hello"}'

# Expected response:
# {"message": "world", "success": true}
```

### Building for Production

```bash
# Build all packages
turbo build

# Build specific packages
turbo build --filter=@monorepo-poc/frontend
turbo build --filter=@monorepo-poc/backend

# Clean build artifacts
turbo clean
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Building Individual Images

```bash
# Build frontend image
docker build -f apps/frontend/Dockerfile -t monorepo-poc-frontend .

# Build backend image
docker build -f apps/backend/Dockerfile -t monorepo-poc-backend .

# Test images locally
docker run -p 3000:3000 monorepo-poc-frontend
docker run -p 3001:3001 monorepo-poc-backend
```

## 🔧 Development Tools

### Code Quality

```bash
# Lint all packages
turbo lint

# Format code (if prettier is configured)
pnpm format

# Type checking
pnpm --filter @monorepo-poc/frontend tsc --noEmit
pnpm --filter @monorepo-poc/backend tsc --noEmit
```

### Debugging

#### Frontend Debugging

1. **Browser DevTools:**

   - Open browser DevTools (F12)
   - Check Console for errors
   - Use Network tab to inspect API calls

2. **VS Code Debugging:**

   ```json
   // .vscode/launch.json
   {
   	"type": "node",
   	"request": "attach",
   	"name": "Debug Next.js",
   	"port": 9229
   }
   ```

3. **Enable debug logging:**
   ```bash
   # Add to apps/frontend/.env.local
   DEBUG=1
   NEXT_PUBLIC_DEBUG=true
   ```

#### Backend Debugging

1. **VS Code Debugging:**

   ```json
   // .vscode/launch.json
   {
   	"type": "node",
   	"request": "launch",
   	"name": "Debug Nest.js",
   	"program": "${workspaceFolder}/apps/backend/src/main.ts",
   	"outFiles": ["${workspaceFolder}/apps/backend/dist/**/*.js"]
   }
   ```

2. **Enable debug logging:**

   ```bash
   # Add to apps/backend/.env.local
   LOG_LEVEL=debug
   DEBUG=*
   ```

3. **API testing with curl:**

   ```bash
   # Test valid input
   curl -X POST http://localhost:3001/hello \
     -H "Content-Type: application/json" \
     -d '{"input": "hello"}'

   # Test invalid input
   curl -X POST http://localhost:3001/hello \
     -H "Content-Type: application/json" \
     -d '{"input": "world"}'
   ```

## 📦 Package Management

### Adding Dependencies

Always use pnpm CLI with exact versions:

```bash
# Add to root workspace
pnpm add -E <package>

# Add to specific workspace
pnpm --filter @monorepo-poc/frontend add -E <package>
pnpm --filter @monorepo-poc/backend add -E <package>
pnpm --filter @monorepo-poc/schemas add -E <package>

# Add dev dependencies
pnpm add -ED <package>
```

### Managing Workspace Dependencies

```bash
# List all dependencies
pnpm list --depth=0

# Check for outdated packages
pnpm outdated

# Update dependencies
pnpm update

# Remove unused dependencies
pnpm prune
```

## 🔄 Git Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Format

Follow conventional commits:

```bash
# Feature
git commit -m "feat: add user authentication"

# Bug fix
git commit -m "fix: resolve CORS issue"

# Documentation
git commit -m "docs: update README"

# Refactor
git commit -m "refactor: improve error handling"

# Test
git commit -m "test: add integration tests"
```

### Pre-commit Checks

Before committing, run:

```bash
# Build all packages
turbo build

# Run all tests
pnpm test

# Lint code
turbo lint

# Type check
pnpm --filter @monorepo-poc/frontend tsc --noEmit
pnpm --filter @monorepo-poc/backend tsc --noEmit
```

## 🚀 Deployment Testing

### Local Production Testing

Test production builds locally:

```bash
# Build for production
turbo build

# Start production servers
pnpm --filter @monorepo-poc/frontend start
pnpm --filter @monorepo-poc/backend start
```

### Docker Production Testing

```bash
# Build production images
docker build -f apps/frontend/Dockerfile -t frontend-prod .
docker build -f apps/backend/Dockerfile -t backend-prod .

# Run production containers
docker run -p 3000:3000 -e NODE_ENV=production frontend-prod
docker run -p 3001:3001 -e NODE_ENV=production backend-prod
```

## 🔍 Common Development Tasks

### Adding a New API Endpoint

1. **Update shared schema:**

   ```typescript
   // packages/schemas/src/new-feature.schema.ts
   export const NewFeatureSchema = z.object({
   	// Define schema
   });
   ```

2. **Add backend endpoint:**

   ```typescript
   // apps/backend/src/controllers/new-feature.controller.ts
   @Controller("new-feature")
   export class NewFeatureController {
   	// Implement endpoint
   }
   ```

3. **Update frontend to use endpoint:**

   ```typescript
   // apps/frontend/src/lib/api-client.ts
   export const callNewFeature = async (data: NewFeatureInput) => {
   	// Implement API call
   };
   ```

4. **Add tests:**

   ```bash
   # Backend tests
   pnpm --filter @monorepo-poc/backend test

   # Frontend tests
   pnpm --filter @monorepo-poc/frontend test
   ```

### Adding a New Component

1. **Create component:**

   ```typescript
   // apps/frontend/src/components/NewComponent.tsx
   export const NewComponent = () => {
   	// Component implementation
   };
   ```

2. **Add tests:**

   ```typescript
   // apps/frontend/src/components/NewComponent.test.tsx
   import { render } from "@testing-library/react";
   import { NewComponent } from "./NewComponent";

   test("renders component", () => {
   	render(<NewComponent />);
   });
   ```

3. **Update exports:**
   ```typescript
   // apps/frontend/src/components/index.ts
   export { NewComponent } from "./NewComponent";
   ```

### Updating Validation Schema

1. **Modify schema:**

   ```typescript
   // packages/schemas/src/hello.schema.ts
   export const HelloInputSchema = z.object({
   	input: z.string().min(1).max(100), // Add length validation
   });
   ```

2. **Rebuild schemas:**

   ```bash
   pnpm --filter @monorepo-poc/schemas build
   ```

3. **Update tests:**

   ```bash
   pnpm --filter @monorepo-poc/schemas test
   ```

4. **Test in both apps:**
   ```bash
   pnpm --filter @monorepo-poc/frontend test
   pnpm --filter @monorepo-poc/backend test
   ```

## 📊 Performance Optimization

### Development Performance

```bash
# Use Turborepo caching
turbo build --cache-dir=.turbo

# Parallel execution
turbo dev --parallel

# Skip unchanged packages
turbo build --filter=...@main
```

### Build Optimization

```bash
# Analyze bundle size (frontend)
pnpm --filter @monorepo-poc/frontend build -- --analyze

# Check build output
ls -la apps/frontend/.next/
ls -la apps/backend/dist/
```

## 🛠️ IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
	"typescript.preferences.includePackageJsonAutoImports": "on",
	"typescript.suggest.autoImports": true,
	"editor.formatOnSave": true,
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	},
	"files.exclude": {
		"**/node_modules": true,
		"**/.turbo": true,
		"**/dist": true,
		"**/.next": true
	}
}
```

### Recommended Extensions

- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Docker
- GitLens

## 📚 Learning Resources

### Understanding the Stack

- **Monorepos**: [Turborepo Documentation](https://turbo.build/repo/docs)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Nest.js**: [Nest.js Documentation](https://docs.nestjs.com/)
- **Zod**: [Zod Documentation](https://zod.dev/)
- **pnpm**: [pnpm Documentation](https://pnpm.io/)

### Best Practices

- **TypeScript**: Use strict mode and explicit types
- **Testing**: Write tests for all new features
- **Git**: Use conventional commits and meaningful messages
- **Code Review**: Review all changes before merging
- **Documentation**: Keep documentation up to date

This workflow guide should help you be productive with local development. Remember to run tests frequently and keep your dependencies up to date!
