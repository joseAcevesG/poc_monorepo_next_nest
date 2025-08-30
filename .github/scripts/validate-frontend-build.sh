#!/bin/bash

# Frontend Build Validation Script
# This script simulates the GitHub Actions workflow steps locally

set -e

echo "🚀 Starting frontend build validation..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/frontend" ]; then
    echo "❌ Error: Please run this script from the monorepo root directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Error: Node.js 22 or higher is required (current: $(node --version))"
    exit 1
fi

echo "✅ Node.js version check passed: $(node --version)"

# Check pnpm installation
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed"
    exit 1
fi

echo "✅ pnpm version check passed: $(pnpm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build affected packages
echo "🔨 Building affected packages..."
pnpm turbo build --filter=@monorepo-poc/frontend...

# Run tests for affected packages
echo "🧪 Running tests for affected packages..."
pnpm turbo test --filter=@monorepo-poc/frontend...

# Validate Docker build (optional - requires Docker)
if command -v docker &> /dev/null; then
    echo "🐳 Testing Docker build..."
    docker build --file apps/frontend/Dockerfile --tag monorepo-poc-frontend:test .
    echo "✅ Docker build successful"
    
    # Clean up test image
    docker rmi monorepo-poc-frontend:test
else
    echo "⚠️  Docker not found - skipping Docker build test"
fi

echo "🎉 Frontend build validation completed successfully!"
echo ""
echo "Your changes are ready for the GitHub Actions workflow."
echo "The following commands were validated:"
echo "  - pnpm install --frozen-lockfile"
echo "  - pnpm turbo build --filter=@monorepo-poc/frontend..."
echo "  - pnpm turbo test --filter=@monorepo-poc/frontend..."
echo "  - docker build --file apps/frontend/Dockerfile ."