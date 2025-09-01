# Requirements Document

## Introduction

This feature involves migrating the monorepo from ESLint and Prettier to Biome 2.2, leveraging its new monorepo capabilities and domain features. The migration will establish a global configuration with best practices for Next.js and Nest.js, while allowing each app to have specific configurations. The solution will maintain compatibility by keeping ESLint for rules that Biome doesn't support yet.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to use Biome 2.2 as the primary linter and formatter, so that I can benefit from its performance and monorepo capabilities.

#### Acceptance Criteria

1. WHEN the project is configured THEN Biome 2.2 SHALL be installed as the primary linting and formatting tool
2. WHEN running lint commands THEN Biome SHALL process all TypeScript and JavaScript files in the monorepo
3. WHEN Biome is configured THEN it SHALL use the latest version 2.2 with monorepo support enabled

### Requirement 2

**User Story:** As a developer, I want a global Biome configuration with best practices for Next.js and Nest.js, so that all apps follow consistent coding standards.

#### Acceptance Criteria

1. WHEN the global configuration is created THEN it SHALL include best practices for Next.js applications
2. WHEN the global configuration is created THEN it SHALL include best practices for Nest.js applications
3. WHEN the global configuration is created THEN it SHALL use Biome's domain features for better organization
4. WHEN apps inherit from global config THEN they SHALL automatically apply the base rules

### Requirement 3

**User Story:** As a developer, I want each app to have its own Biome configuration that extends the global one, so that app-specific rules can be applied while maintaining consistency.

#### Acceptance Criteria

1. WHEN the frontend app has its own config THEN it SHALL extend the global configuration
2. WHEN the backend app has its own config THEN it SHALL extend the global configuration
3. WHEN app-specific configs are created THEN they SHALL only contain rules specific to that application type
4. WHEN Biome processes files THEN it SHALL apply both global and app-specific rules appropriately

### Requirement 4

**User Story:** As a developer, I want to maintain ESLint for rules that Biome doesn't support, so that no existing code quality checks are lost during migration.

#### Acceptance Criteria

1. WHEN comparing ESLint and Biome rules THEN unsupported rules SHALL be identified and documented
2. WHEN ESLint rules are not available in Biome THEN those specific rules SHALL remain in ESLint configuration
3. WHEN running lint commands THEN both Biome and ESLint SHALL execute for comprehensive checking
4. WHEN ESLint is kept for specific rules THEN it SHALL only run on files that need those specific checks

### Requirement 5

**User Story:** As a developer, I want updated package.json scripts for format and check commands, so that I can easily run linting and formatting operations.

#### Acceptance Criteria

1. WHEN package.json scripts are updated THEN there SHALL be a "format" command that runs Biome formatting
2. WHEN package.json scripts are updated THEN there SHALL be a "check" command that runs Biome linting
3. WHEN scripts include ESLint fallback THEN the "lint" command SHALL run both Biome and ESLint
4. WHEN scripts are configured THEN they SHALL work at both root level and individual app level
5. WHEN Turborepo is configured THEN it SHALL cache Biome operations for performance

### Requirement 6

**User Story:** As a developer, I want the migration to preserve existing code formatting preferences, so that the codebase remains consistent after migration.

#### Acceptance Criteria

1. WHEN Biome configuration is created THEN it SHALL match existing Prettier formatting rules where possible
2. WHEN formatting rules differ THEN the team SHALL be notified of changes before applying
3. WHEN migration is complete THEN existing code SHALL pass all new linting and formatting checks
4. WHEN configuration is applied THEN it SHALL not break existing CI/CD pipelines
