# Frontend Dockerfile - Multi-stage build with Node.js 22 Alpine
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
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/schemas/package.json ./packages/schemas/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder

# Copy source code
COPY packages/schemas ./packages/schemas
COPY apps/frontend ./apps/frontend

# Build the schemas package first
RUN pnpm --filter @monorepo-poc/schemas build

# Build the frontend application
RUN pnpm --filter @monorepo-poc/frontend build

# Production stage
FROM node:22-alpine AS runner

# Install pnpm
RUN corepack enable pnpm

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package.json and install production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/packages/schemas/package.json ./packages/schemas/

# Copy built schemas package
COPY --from=builder --chown=nextjs:nodejs /app/packages/schemas/dist ./packages/schemas/dist

# Copy built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/frontend/server.js"]