# Implementation Plan

- [x] 1. Install and configure Biome 2.2 in the monorepo

  - Install @biomejs/biome@2.2.0 as dev dependency in root package.json
  - Create root biome.json configuration with domains and base rules
  - Configure schema reference for IDE support
  - _Requirements: 1.1, 2.1, 2.2_

- [x] 2. Create root Biome configuration with domains
- [x] 2.1 Implement base biome.json with domains configuration

  - Write root biome.json with Project and Test domains only
  - Configure formatter settings to match current Prettier preferences
  - Set up linter rules with recommended defaults and custom enhancements
  - _Requirements: 2.1, 2.2, 6.1_

- [x] 2.2 Configure enhanced rules not in current ESLint setup

  - Add security rules (noGlobalIsFinite, noGlobalIsNan, noInvalidNewBuiltin)
  - Add performance rules (noAccumulatingSpread, useSimplifiedLogicExpression)
  - Add code quality rules (noUnusedTemplateLiteral, useShorthandArrayType)
  - _Requirements: 2.1, 6.1_

- [x] 3. Create app-specific Biome configurations
- [x] 3.1 Implement frontend app Biome configuration

  - Create apps/frontend/biome.json extending root with "extends": "//"
  - Set root: false for nested configuration
  - Add Next.js and React domains for frontend-specific rules
  - Configure JSX and React-specific formatting preferences
  - _Requirements: 3.1, 3.3_

- [x] 3.2 Implement backend app Biome configuration

  - Create apps/backend/biome.json extending root with "extends": "//"
  - Set root: false for nested configuration
  - Add Nest.js specific overrides for decorators and API patterns
  - _Requirements: 3.2, 3.3_

- [x] 3.3 Implement shared package Biome configuration

  - Create packages/schemas/biome.json extending root configuration
  - Configure library-specific rules (no console.log, strict exports)
  - Add Zod schema validation patterns if available
  - _Requirements: 3.1, 3.2_

- [x] 4. Analyze current ESLint configuration and enhance with Biome best practices
- [x] 4.1 Compare current ESLint rules with Biome capabilities

  - Audit apps/frontend/eslint.config.mjs for Biome equivalents
  - Audit apps/backend/eslint.config.mjs for Biome equivalents
  - Document rules that need ESLint fallback vs rules available in Biome
  - _Requirements: 4.1, 4.2_

- [x] 4.2 Identify and configure additional best practice rules not in current ESLint

  - Research Biome rules not currently enabled in ESLint configurations
  - Add security rules (noGlobalIsFinite, noGlobalIsNan, noInvalidNewBuiltin)
  - Add performance rules (noAccumulatingSpread, useSimplifiedLogicExpression)
  - Add import management rules (useImportExtensions, noUndeclaredDependencies)
  - Add TypeScript enhancement rules (noConstEnum, noEnum, noEvolvingTypes)
  - Configure appropriate severity levels for new rules
  - _Requirements: 2.1, 6.1_

- [x] 4.3 Create minimal ESLint configurations for unsupported rules

  - Update frontend ESLint config to only include unsupported rules
  - Update backend ESLint config to only include unsupported rules
  - Remove rules now handled by Biome domains
  - _Requirements: 4.2, 4.3_

- [x] 5. Update package.json scripts for Biome commands
- [x] 5.1 Add Biome scripts to root package.json

  - Add "format": "biome format --write ." command
  - Add "format:check": "biome format ." command
  - Add "lint": "biome lint ." command
  - Add "check": "biome check ." command for combined linting and formatting
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 5.2 Add Biome scripts to app-level package.json files

  - Update apps/frontend/package.json with Biome scripts
  - Update apps/backend/package.json with Biome scripts
  - Update packages/schemas/package.json with Biome scripts
  - _Requirements: 5.4_

- [x] 5.3 Update combined lint scripts to run both Biome and ESLint

  - Create "lint:all" script that runs both Biome and ESLint
  - Update existing lint scripts to prioritize Biome
  - Ensure proper error handling and exit codes
  - _Requirements: 4.4, 5.3_

- [x] 6. Configure Turborepo integration for Biome
- [x] 6.1 Update turbo.json to include Biome tasks

  - Add "format" task to turbo.json with proper caching
  - Add "lint" task to turbo.json with proper caching
  - Configure task dependencies and outputs
  - _Requirements: 5.5_

- [x] 6.2 Test Turborepo caching with Biome operations

  - Verify that Biome format operations are cached correctly
  - Verify that Biome lint operations are cached correctly
  - Test cache invalidation on configuration changes
  - _Requirements: 5.5_

- [x] 7. Validate migration and formatting consistency
- [x] 7.1 Test Biome formatting against current Prettier output

  - Run Biome format on existing codebase
  - Compare output with current Prettier formatting
  - Adjust Biome configuration to match existing preferences
  - _Requirements: 6.2, 6.3_

- [x] 7.2 Validate linting rules application across monorepo

  - Test that root configuration applies to all packages
  - Test that app-specific configurations extend properly
  - Verify domain rules are activated based on dependencies
  - _Requirements: 2.3, 3.4, 6.4_

- [x] 7.3 Test ESLint fallback functionality

  - Verify ESLint still catches unsupported rule violations
  - Test combined Biome + ESLint execution
  - Ensure no conflicts between Biome and ESLint rules
  - _Requirements: 4.5_

- [ ] 8. Update CI/CD workflows for Biome integration
- [ ] 8.1 Update GitHub Actions workflows to use Biome commands

  - Replace ESLint/Prettier commands with Biome equivalents
  - Update workflow to run both Biome and ESLint where needed
  - Ensure proper error reporting and job failure handling
  - _Requirements: 6.4_

- [ ] 8.2 Test CI/CD pipeline with new Biome configuration

  - Verify that workflows pass with new linting setup
  - Test that formatting checks work correctly
  - Validate that build processes are not broken
  - _Requirements: 6.4_

- [ ] 9. Create migration documentation and cleanup
- [ ] 9.1 Document new Biome configuration and commands

  - Update README.md with new lint and format commands
  - Document domain features and their benefits
  - Create migration guide for team members
  - _Requirements: 6.1, 6.2_

- [ ] 9.2 Remove unused ESLint and Prettier dependencies
  - Remove Prettier dependencies where no longer needed
  - Remove ESLint rules and plugins now handled by Biome
  - Clean up configuration files and scripts
  - _Requirements: 6.3_
