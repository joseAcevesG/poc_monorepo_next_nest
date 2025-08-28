# Multi-stage build for production
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.15.0

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files
COPY packages/schemas/package.json ./packages/schemas/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/schemas ./packages/schemas
COPY apps/backend ./apps/backend

# Build the application
FROM base AS builder
RUN pnpm --filter @monorepo-poc/schemas build
RUN pnpm --filter @monorepo-poc/backend build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN npm install -g pnpm@10.15.0

WORKDIR /app

# Copy package files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/schemas/package.json ./packages/schemas/
COPY apps/backend/package.json ./apps/backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/packages/schemas/dist ./packages/schemas/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Expose port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
CMD ["node", "apps/backend/dist/main.js"]