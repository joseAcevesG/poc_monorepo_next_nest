# Biome Migration Guide

This document explains the migration from ESLint and Prettier to Biome 2.2 in the monorepo.

## Overview

The monorepo has been migrated to use **Biome 2.2** as the primary linter and formatter, while maintaining ESLint for rules not yet supported by Biome. This provides significant performance improvements and better monorepo support.

## What Changed

### Replaced Tools

- **Prettier** → **Biome Formatter** (complete replacement)
- **ESLint** → **Biome Linter** (complete replacement)

### New Commands

| Old Command          | New Command         | Description              |
| -------------------- | ------------------- | ------------------------ |
| `prettier --write .` | `pnpm format`       | Format all files         |
| `prettier --check .` | `pnpm format:check` | Check formatting         |
| `eslint .`           | `pnpm lint`         | Primary linting (Biome)  |
| `eslint . --fix`     | `pnpm check`        | Lint and format together |

## Biome Configuration Structure

### Hierarchical Configuration

```
monorepo-poc/
├── biome.json                     # Root config (base rules)
├── apps/
│   ├── frontend/biome.json       # Extends root + Next.js/React domains
│   └── backend/biome.json        # Extends root + Nest.js rules
└── packages/
    └── schemas/biome.json         # Extends root + library rules
```

### Domain Features

Biome 2.2 introduces **domains** that automatically activate framework-specific rules:

#### Root Configuration Domains

- **Project Domain**: Cross-file analysis, import cycle detection, type inference
- **Test Domain**: Testing best practices for Vitest files

#### Frontend-Specific Domains

- **Next.js Domain**: Automatically enabled when Next.js ≥14.0.0 detected
  - `noImgElement`, `noHeadElement`, `useExhaustiveDependencies`
- **React Domain**: Automatically enabled when React ≥16.0.0 detected
  - React hooks linting, JSX key validation, component patterns

#### Backend Configuration

- Custom Nest.js rules for decorators and API patterns
- Node.js environment settings

## Enhanced Rules

### New Rules Added (Not in Previous ESLint)

**Security Rules:**

- `noGlobalIsFinite`, `noGlobalIsNan`, `noInvalidNewBuiltin`

**Performance Rules:**

- `noAccumulatingSpread`, `useSimplifiedLogicExpression`

**Code Quality:**

- `noUnusedTemplateLiteral`, `useShorthandArrayType`, `useSortedClasses`

**Import Management:**

- `useImportExtensions`, `noUndeclaredDependencies`

**TypeScript Enhancements:**

- `noConstEnum`, `noEnum`, `noEvolvingTypes`

### Complete Migration

All ESLint and Prettier configurations have been removed. Biome now handles all linting and formatting responsibilities with its comprehensive rule set and domain-specific features.

## Performance Benefits

### Speed Improvements

- **Linting**: ~10x faster than ESLint
- **Formatting**: ~20x faster than Prettier
- **Monorepo**: Better caching and incremental processing

### Turborepo Integration

- Biome operations are cached by Turborepo
- Faster CI/CD pipeline execution
- Better incremental builds

## Developer Experience

### IDE Integration

- Biome LSP provides real-time linting and formatting
- JSON schema validation for biome.json files
- Better error messages and suggestions

### Command Consistency

All workspaces now have consistent commands:

```bash
pnpm format        # Format with Biome
pnpm lint          # Lint with Biome
pnpm check         # Combined lint + format
pnpm lint:all      # Biome + ESLint comprehensive
```

## Migration Benefits

### Immediate Benefits

1. **Performance**: Significantly faster linting and formatting
2. **Consistency**: Single tool for both linting and formatting
3. **Monorepo Support**: Native hierarchical configuration
4. **Framework Awareness**: Automatic rule activation via domains

### Future Benefits

1. **Rule Coverage**: Biome is rapidly adding ESLint rule equivalents
2. **Maintenance**: Fewer dependencies and configuration files
3. **Innovation**: Biome introduces new rules not available in ESLint

## Troubleshooting

### Common Issues

**Q: Biome formatting differs from Prettier**
A: Check the formatter configuration in biome.json. The migration preserves most Prettier settings.

**Q: Missing linting rules**
A: Biome now handles all linting. Check the biome.json configuration and domain settings for rule coverage.

**Q: IDE not recognizing Biome**
A: Ensure your IDE has the Biome extension installed and enabled.

### Configuration Debugging

```bash
# Check Biome configuration
biome explain <file>

# Validate configuration
biome check --verbose

# Test specific rules
biome lint --verbose
```

## Future Roadmap

### Planned Improvements

1. **Custom Rules**: Explore Biome plugin system when available
2. **Advanced Domains**: Utilize new domains as they're released
3. **Performance Optimization**: Fine-tune configuration for optimal performance

### Monitoring

- Track Biome releases for new features and domains
- Monitor performance improvements in CI/CD
- Evaluate new rule additions and domain enhancements

## Resources

- [Biome Documentation](https://biomejs.dev/)
- [Biome vs ESLint Comparison](https://biomejs.dev/guides/migrate-eslint/)
- [Biome Domains Guide](https://biomejs.dev/linter/rules/)
- [Migration Spec](./.kiro/specs/biome-migration/)
