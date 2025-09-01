# Design Document

## Overview

This design outlines the migration from ESLint and Prettier to Biome 2.2, leveraging its monorepo capabilities and domain features. The solution will establish a hierarchical configuration system with a root configuration providing base rules for Next.js and Nest.js applications, while allowing each app to extend and customize these rules. ESLint will be retained for rules not yet supported by Biome to ensure no regression in code quality checks.

## Architecture

### Configuration Hierarchy

```
monorepo-poc/
├── biome.json                     # Root configuration (global rules)
├── apps/
│   ├── frontend/
│   │   └── biome.json            # Frontend-specific config (extends root)
│   └── backend/
│       └── biome.json            # Backend-specific config (extends root)
└── packages/
    └── schemas/
        └── biome.json            # Shared package config (extends root)
```

### Tool Integration Strategy

1. **Primary Tool**: Biome 2.2 for linting and formatting
2. **Domains Feature**: Automatic framework detection and rule activation
3. **Fallback Tool**: ESLint for unsupported rules
4. **Build Integration**: Turborepo caching for both tools
5. **Command Orchestration**: Package.json scripts to run both tools

### Domains Architecture

Biome 2.2's domains feature provides automatic framework detection and rule activation:

- **Automatic Detection**: Domains are activated based on dependencies in package.json
- **Framework-Specific Rules**: Each domain provides curated rules for specific frameworks
- **Cross-File Analysis**: Project domain enables type inference and import analysis
- **Performance Impact**: Project domain scanning affects performance but provides advanced analysis

## Components and Interfaces

### Root Configuration (biome.json)

**Purpose**: Establish base rules and formatting standards for the entire monorepo

**Key Features**:

- Biome 2.2 domains for framework-specific best practices
- Next.js domain for React and App Router patterns
- Project domain for monorepo-wide analysis and type inference
- Test domain for testing best practices across all packages
- Shared formatting rules (matching current Prettier config)

**Configuration Structure**:

```json
{
	"$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"correctness": {
				"noUnusedVariables": "error",
				"noUndeclaredVariables": "error"
			},
			"suspicious": {
				"noExplicitAny": "warn",
				"noConsoleLog": "warn"
			},
			"style": {
				"useConst": "error",
				"useTemplate": "error"
			}
		},
		"domains": {
			"project": "recommended",
			"test": "recommended"
		}
	},
	"formatter": {
		"enabled": true,
		"lineWidth": 80,
		"indentStyle": "space",
		"indentWidth": 2,
		"quoteStyle": "single",
		"trailingCommas": "all"
	},
	"organizeImports": {
		"enabled": true
	}
}
```

**Domains Explanation**:

- **Project Domain** (Root): Enables cross-file analysis including `noFloatingPromises`, `noUndeclaredDependencies`, and import cycle detection with type inference
- **Test Domain** (Root): Activates testing-specific rules for better test practices across Vitest test files
- **Next.js Domain** (Frontend only): Automatically enables Next.js-specific rules like `noImgElement`, `noHeadElement`, `useExhaustiveDependencies` for React hooks when Next.js >=14.0.0 is detected
- **React Domain** (Frontend only): Provides React-specific linting for hooks, JSX keys, and component patterns when React >=16.0.0 is detected

**Enhanced Best Practices**:

The migration will also introduce additional best practice rules not currently configured in ESLint:

- **Security Rules**: `noGlobalIsFinite`, `noGlobalIsNan`, `noInvalidNewBuiltin`
- **Performance Rules**: `noAccumulatingSpread`, `useSimplifiedLogicExpression`
- **Code Quality**: `noUnusedTemplateLiteral`, `useShorthandArrayType`, `useSortedClasses`
- **Import Management**: `useImportExtensions`, `noUndeclaredDependencies`
- **TypeScript Enhancements**: `noConstEnum`, `noEnum`, `noEvolvingTypes`

### App-Specific Configurations

**Frontend (apps/frontend/biome.json)**:

- Extends root configuration using `"extends": "//"`
- Adds Next.js and React domains for frontend-specific rules
- Next.js specific rules (App Router patterns, React Server Components)
- JSX formatting preferences and React hook linting
- Import organization for React components

**Backend (apps/backend/biome.json)**:

- Extends root configuration using `"extends": "//"`
- Nest.js specific rules (decorator usage, module patterns)
- Node.js environment settings
- API-specific linting rules

**Shared Package (packages/schemas/biome.json)**:

- Extends root configuration
- Library-specific rules (no console.log, strict exports)
- Zod schema validation patterns

### ESLint Fallback Configuration

**Purpose**: Handle rules not yet supported by Biome

**Identified Unsupported Rules**:

- `@typescript-eslint/no-unsafe-argument` (TypeScript strict type checking - not yet in Biome)
- Next.js core-web-vitals rules (performance and accessibility - partially covered by domains)
- Some TypeScript-ESLint strict mode rules not yet implemented in Biome

**Note**: `@typescript-eslint/no-floating-promises` is now available in Biome's project domain as `noFloatingPromises`

**Implementation**:

- Minimal ESLint configs focusing only on unsupported rules
- Separate execution from Biome to avoid conflicts
- Gradual migration as Biome adds support for missing rules

## Data Models

### Configuration Schema

```typescript
interface BiomeConfig {
	$schema: string;
	root?: boolean;
	extends?: string | string[];
	linter: {
		enabled: boolean;
		rules: {
			recommended?: boolean;
			[domain: string]: RuleDomain;
		};
	};
	formatter: {
		enabled: boolean;
		lineWidth: number;
		indentStyle: "tab" | "space";
		indentWidth: number;
		quoteStyle: "single" | "double";
		trailingCommas: "none" | "es5" | "all";
	};
	organizeImports: {
		enabled: boolean;
	};
	files?: {
		include?: string[];
		exclude?: string[];
	};
}

interface RuleDomain {
	[ruleName: string]: "error" | "warn" | "off" | RuleConfig;
}
```

### Package.json Script Structure

```typescript
interface Scripts {
	// Biome commands
	format: "biome format --write .";
	"format:check": "biome format .";
	lint: "biome lint .";
	"lint:fix": "biome lint --write .";

	// Combined commands (Biome + ESLint)
	check: "biome check .";
	"check:fix": "biome check --write .";
	"lint:all": "biome lint . && eslint .";

	// Turborepo integration
	"turbo:lint": "turbo lint";
	"turbo:format": "turbo format";
}
```

## Rule Analysis and Enhancement

### Current ESLint Configuration Analysis

**Frontend Configuration**:

- Uses Next.js core-web-vitals and TypeScript recommended rules
- Minimal custom rule configuration
- Focuses on Next.js specific patterns

**Backend Configuration**:

- Uses TypeScript-ESLint recommended and type-checked rules
- Prettier integration for formatting
- Custom rules: `@typescript-eslint/no-explicit-any: off`, `@typescript-eslint/no-floating-promises: warn`

### Biome Enhancement Opportunities

**Additional Rules to Enable**:

1. **Security Enhancements**: Rules not in current ESLint but available in Biome
2. **Performance Optimizations**: Biome-specific rules for better code performance
3. **Import Management**: Better import organization and dependency tracking
4. **TypeScript Strictness**: Enhanced TypeScript rules beyond current setup
5. **Accessibility**: Additional a11y rules through domains

**Migration Strategy**:

- Start with equivalent rules to maintain current behavior
- Gradually introduce enhanced rules with appropriate severity levels
- Use domains to automatically enable framework-specific best practices
- Document new rules and their benefits for team adoption

## Error Handling

### Migration Validation

1. **Rule Compatibility Check**: Compare existing ESLint rules with Biome equivalents
2. **Best Practice Enhancement**: Identify and configure additional rules not in current ESLint setup
3. **Format Preservation**: Ensure Biome formatting matches current Prettier output
4. **CI/CD Integration**: Update workflows to use new commands without breaking builds
5. **Rule Gap Analysis**: Document rules that need ESLint fallback vs new Biome capabilities

### Fallback Mechanisms

1. **ESLint Retention**: Keep ESLint for unsupported rules with minimal configuration
2. **Gradual Migration**: Allow incremental adoption of Biome rules
3. **Error Reporting**: Clear distinction between Biome and ESLint errors in output

### Configuration Validation

1. **Schema Validation**: Use Biome's JSON schema for configuration validation
2. **Extends Resolution**: Ensure proper inheritance from root configuration
3. **Rule Conflicts**: Detect and resolve conflicts between Biome and ESLint rules

## Testing Strategy

### Configuration Testing

1. **Rule Application**: Verify that rules are correctly applied at each level
2. **Inheritance Testing**: Ensure app configs properly extend root configuration
3. **Format Consistency**: Test that formatting output matches expectations

### Integration Testing

1. **CI/CD Pipeline**: Test new commands in existing GitHub Actions workflows
2. **Turborepo Caching**: Verify that Biome operations are properly cached
3. **Editor Integration**: Test LSP functionality with new configurations

### Migration Validation

1. **Before/After Comparison**: Compare linting results before and after migration
2. **Performance Testing**: Measure improvement in linting and formatting speed
3. **Developer Experience**: Validate that new commands work as expected

### Test Cases

```typescript
// Example test scenarios
describe("Biome Configuration", () => {
	test("Root config applies to all files", () => {
		// Test that base rules are enforced across monorepo
	});

	test("Frontend config extends root with Next.js rules", () => {
		// Test Next.js specific rules in frontend app
	});

	test("Backend config extends root with Nest.js rules", () => {
		// Test Nest.js specific rules in backend app
	});

	test("ESLint handles unsupported rules", () => {
		// Test that TypeScript-specific rules still work
	});

	test("Format output matches Prettier", () => {
		// Test that code formatting is consistent
	});
});
```
