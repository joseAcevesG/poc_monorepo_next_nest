# Backend Dockerfile - Multi-stage build with Node.js 22 Alpine
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy package.json files for all workspaces
COPY apps/backend/package.json ./apps/backend/
COPY packages/schemas/package.json ./packages/schemas/

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build stage
FROM base AS builder

# Copy source code
COPY packages/schemas ./packages/schemas
COPY apps/backend ./apps/backend

# Build the schemas package first
RUN pnpm --filter @monorepo-poc/schemas build

# Build the backend application
RUN pnpm --filter @monorepo-poc/backend build

# Production stage
FROM node:22-alpine AS runner

# Install pnpm
RUN corepack enable pnpm

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy package.json files and install production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/packages/schemas/package.json ./packages/schemas/

# Copy built schemas package
COPY --from=builder --chown=nestjs:nodejs /app/packages/schemas/dist ./packages/schemas/dist

# Copy built backend application
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

USER nestjs

EXPOSE 3001

ENV PORT=3001

CMD ["node", "apps/backend/dist/main.js"]