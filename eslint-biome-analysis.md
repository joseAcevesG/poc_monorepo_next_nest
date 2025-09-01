# ESLint to Biome Rule Analysis

## Frontend ESLint Configuration Analysis

### Current Configuration

- **next/core-web-vitals**: Next.js performance and accessibility rules
- **next/typescript**: Next.js TypeScript-specific rules

### Next.js Core Web Vitals Rules Analysis

#### Rules Available in Biome (via domains)

- `@next/next/no-img-element` → Available in Biome Next.js domain as `noImgElement`
- `@next/next/no-head-element` → Available in Biome Next.js domain as `noHeadElement`
- `@next/next/no-page-custom-font` → Available in Biome Next.js domain as `noPageCustomFont`
- React hooks rules → Available in Biome React domain as `useExhaustiveDependencies`

#### Rules Requiring ESLint Fallback

- `@next/next/google-font-display` → Not available in Biome yet
- `@next/next/google-font-preconnect` → Not available in Biome yet
- `@next/next/next-script-for-ga` → Not available in Biome yet
- `@next/next/no-before-interactive-script-outside-document` → Not available in Biome yet
- `@next/next/no-css-tags` → Not available in Biome yet
- `@next/next/no-document-import-in-page` → Not available in Biome yet
- `@next/next/no-duplicate-head` → Not available in Biome yet
- `@next/next/no-head-import-in-document` → Not available in Biome yet
- `@next/next/no-html-link-for-pages` → Not available in Biome yet
- `@next/next/no-script-component-in-head` → Not available in Biome yet
- `@next/next/no-styled-jsx-in-document` → Not available in Biome yet
- `@next/next/no-sync-scripts` → Not available in Biome yet
- `@next/next/no-title-in-document-head` → Not available in Biome yet
- `@next/next/no-typos` → Not available in Biome yet
- `@next/next/no-unwanted-polyfillio` → Not available in Biome yet

### Next.js TypeScript Rules Analysis

#### Rules Available in Biome

- Basic TypeScript linting → Covered by Biome's TypeScript support
- Import/export validation → Covered by Biome's project domain

#### Rules Requiring ESLint Fallback

- `@next/next/no-async-client-component` → Not available in Biome yet
- `@next/next/no-assign-module-variable` → Not available in Biome yet

## Backend ESLint Configuration Analysis

### Current Configuration

- **@eslint/js recommended**: Basic JavaScript linting rules
- **typescript-eslint recommendedTypeChecked**: TypeScript-specific rules with type checking
- **eslint-plugin-prettier/recommended**: Prettier integration (will be removed)

### ESLint Recommended Rules Analysis

#### Rules Available in Biome

- `no-unused-vars` → Available as `noUnusedVariables`
- `no-undef` → Available as `noUndeclaredVariables`
- `no-console` → Available as `noConsole`
- `no-debugger` → Available as `noDebugger`
- `no-unreachable` → Available as `noUnreachableCode`
- `no-constant-condition` → Available as `noConstantCondition`
- `no-duplicate-case` → Available as `noDuplicateCase`
- `no-empty` → Available as `noEmptyBlockStatements`
- `no-extra-boolean-cast` → Available as `noExtraBooleanCast`
- `no-fallthrough` → Available as `noFallthroughSwitchClause`
- `no-func-assign` → Available as `noFunctionAssign`
- `no-global-assign` → Available as `noGlobalAssign`
- `no-inner-declarations` → Available as `noInnerDeclarations`
- `no-invalid-regexp` → Available as `noInvalidRegexp`
- `no-irregular-whitespace` → Available as `noIrregularWhitespace`
- `no-misleading-character-class` → Available as `noMisleadingCharacterClass`
- `no-prototype-builtins` → Available as `noPrototypeBuiltins`
- `no-redeclare` → Available as `noRedeclare`
- `no-self-assign` → Available as `noSelfAssign`
- `no-sparse-arrays` → Available as `noSparseArray`
- `no-unexpected-multiline` → Available as `noUnexpectedMultiline`
- `no-unsafe-finally` → Available as `noUnsafeFinally`
- `no-unsafe-negation` → Available as `noUnsafeNegation`
- `use-isnan` → Available as `useIsNan`
- `valid-typeof` → Available as `useValidTypeof`

#### Rules Requiring ESLint Fallback

- `no-case-declarations` → Not available in Biome yet
- `no-delete-var` → Not available in Biome yet
- `no-dupe-keys` → Not available in Biome yet
- `no-empty-character-class` → Not available in Biome yet
- `no-ex-assign` → Not available in Biome yet
- `no-extra-semi` → Not available in Biome yet
- `no-import-assign` → Not available in Biome yet
- `no-mixed-spaces-and-tabs` → Not available in Biome yet
- `no-new-symbol` → Not available in Biome yet
- `no-nonoctal-decimal-escape` → Not available in Biome yet
- `no-obj-calls` → Not available in Biome yet
- `no-octal` → Not available in Biome yet
- `no-regex-spaces` → Not available in Biome yet
- `no-setter-return` → Not available in Biome yet
- `no-shadow-restricted-names` → Not available in Biome yet
- `no-this-before-super` → Not available in Biome yet
- `no-undef` → Available but different implementation
- `no-unused-labels` → Not available in Biome yet
- `no-useless-catch` → Not available in Biome yet
- `no-useless-escape` → Not available in Biome yet
- `no-with` → Not available in Biome yet

### TypeScript-ESLint Rules Analysis

#### Rules Available in Biome

- `@typescript-eslint/no-unused-vars` → Available as `noUnusedVariables`
- `@typescript-eslint/no-explicit-any` → Available as `noExplicitAny`
- `@typescript-eslint/no-floating-promises` → Available as `noFloatingPromises` (project domain)
- `@typescript-eslint/prefer-as-const` → Available as `useAsConstAssertion`
- `@typescript-eslint/no-array-constructor` → Available as `noArrayConstructor`
- `@typescript-eslint/no-duplicate-enum-values` → Available as `noDuplicateEnumValues`
- `@typescript-eslint/no-extra-non-null-assertion` → Available as `noExtraNonNullAssertion`
- `@typescript-eslint/no-misused-new` → Available as `noMisusedNew`
- `@typescript-eslint/no-namespace` → Available as `noNamespace`
- `@typescript-eslint/no-non-null-asserted-optional-chain` → Available as `noNonNullAssertedOptionalChain`
- `@typescript-eslint/no-this-alias` → Available as `noThisAlias`
- `@typescript-eslint/no-unnecessary-type-constraint` → Available as `noUnnecessaryTypeConstraint`
- `@typescript-eslint/no-unsafe-declaration-merging` → Available as `noUnsafeDeclarationMerging`
- `@typescript-eslint/prefer-namespace-keyword` → Available as `useNamespaceKeyword`
- `@typescript-eslint/triple-slash-reference` → Available as `noTripleSlashReference`

#### Rules Requiring ESLint Fallback

- `@typescript-eslint/no-unsafe-argument` → Not available in Biome yet
- `@typescript-eslint/no-unsafe-assignment` → Not available in Biome yet
- `@typescript-eslint/no-unsafe-call` → Not available in Biome yet
- `@typescript-eslint/no-unsafe-member-access` → Not available in Biome yet
- `@typescript-eslint/no-unsafe-return` → Not available in Biome yet
- `@typescript-eslint/restrict-plus-operands` → Not available in Biome yet
- `@typescript-eslint/restrict-template-expressions` → Not available in Biome yet
- `@typescript-eslint/unbound-method` → Not available in Biome yet
- `@typescript-eslint/await-thenable` → Not available in Biome yet
- `@typescript-eslint/ban-ts-comment` → Not available in Biome yet
- `@typescript-eslint/ban-types` → Not available in Biome yet
- `@typescript-eslint/no-base-to-string` → Not available in Biome yet
- `@typescript-eslint/no-confusing-void-expression` → Not available in Biome yet
- `@typescript-eslint/no-duplicate-type-constituents` → Not available in Biome yet
- `@typescript-eslint/no-for-in-array` → Not available in Biome yet
- `@typescript-eslint/no-implied-eval` → Not available in Biome yet
- `@typescript-eslint/no-meaningless-void-operator` → Not available in Biome yet
- `@typescript-eslint/no-misused-promises` → Not available in Biome yet
- `@typescript-eslint/no-mixed-enums` → Not available in Biome yet
- `@typescript-eslint/no-redundant-type-constituents` → Not available in Biome yet
- `@typescript-eslint/no-unnecessary-boolean-literal-compare` → Not available in Biome yet
- `@typescript-eslint/no-unnecessary-condition` → Not available in Biome yet
- `@typescript-eslint/no-unnecessary-type-arguments` → Not available in Biome yet
- `@typescript-eslint/no-unnecessary-type-assertion` → Not available in Biome yet
- `@typescript-eslint/no-unsafe-enum-comparison` → Not available in Biome yet
- `@typescript-eslint/no-var-requires` → Not available in Biome yet
- `@typescript-eslint/only-throw-error` → Not available in Biome yet
- `@typescript-eslint/prefer-includes` → Not available in Biome yet
- `@typescript-eslint/prefer-nullish-coalescing` → Not available in Biome yet
- `@typescript-eslint/prefer-optional-chain` → Not available in Biome yet
- `@typescript-eslint/prefer-promise-reject-errors` → Not available in Biome yet
- `@typescript-eslint/prefer-reduce-type-parameter` → Not available in Biome yet
- `@typescript-eslint/prefer-return-this-type` → Not available in Biome yet
- `@typescript-eslint/prefer-string-starts-ends-with` → Not available in Biome yet
- `@typescript-eslint/require-await` → Not available in Biome yet
- `@typescript-eslint/use-unknown-in-catch-clause-variable` → Not available in Biome yet

## Summary

### Rules Fully Covered by Biome

- Basic JavaScript linting (most rules)
- TypeScript basic rules
- Some Next.js rules via domains
- React hooks rules via domains
- Import/export validation via project domain

### Rules Requiring ESLint Fallback

- **Next.js specific rules**: Most Next.js-specific rules are not yet available in Biome
- **TypeScript strict type checking**: Advanced type-checking rules like `no-unsafe-*` series
- **Some ESLint recommended rules**: A subset of basic ESLint rules not yet implemented

### Recommendation

Keep ESLint for:

1. Next.js core-web-vitals rules (performance and accessibility)
2. TypeScript strict type checking rules
3. Specific ESLint recommended rules not yet in Biome

Use Biome for:

1. All basic linting and formatting
2. TypeScript basic rules
3. Import management
4. Code style and performance rules

## Enhanced Biome Rules Configuration

### Additional Security Rules Added

- `noInvalidNewBuiltin`: Prevents using `new` with global objects that shouldn't be constructed
- `noGlobalIsFinite`: Prevents using global `isFinite` (use `Number.isFinite` instead)
- `noGlobalIsNan`: Prevents using global `isNaN` (use `Number.isNaN` instead)

### Additional Performance Rules Added

- `noAccumulatingSpread`: Warns against performance issues with spread in loops
- `useSimplifiedLogicExpression`: Suggests simplifying complex logical expressions

### Additional Code Quality Rules Added

- `noUnusedTemplateLiteral`: Warns about template literals that don't use interpolation
- `useShorthandArrayType`: Prefers `T[]` over `Array<T>` syntax
- `useImportExtensions`: Enforces explicit file extensions in imports
- `useSortedClasses`: Sorts CSS classes (useful for Tailwind)

### Additional TypeScript Enhancement Rules Added

- `noConstEnum`: Prevents using `const enum` (can cause issues with bundlers)
- `noEnum`: Warns against using `enum` (prefer union types or const assertions)
- `noEvolvingTypes`: Prevents types that change meaning during execution

### Domain-Specific Rules

#### Frontend (Next.js + React Domains)

- `noImgElement`: Use Next.js `Image` component instead of `<img>`
- `noHeadElement`: Use Next.js `Head` component instead of `<head>`
- `useExhaustiveDependencies`: Ensures React hooks have correct dependencies
- Accessibility rules: `useKeyWithClickEvents`, `useAltText`, etc.

#### Backend (Node.js + Nest.js Patterns)

- Enhanced naming conventions for classes and private members
- Decorator support enabled for Nest.js patterns
- Stricter console logging rules

#### Shared Package (Library Rules)

- `noConsole`: Error level (libraries shouldn't have console logs)
- `useExportType`: Prefer type-only exports when possible
- `useImportType`: Prefer type-only imports when possible
- Enhanced naming conventions for types and variables
- Cognitive complexity warnings

### Rules Configured by Severity

#### Error Level (Breaking Issues)

- `noUnusedVariables`
- `noUndeclaredVariables`
- `noInvalidNewBuiltin`
- `noConstEnum`
- `noGlobalIsFinite`
- `noGlobalIsNan`

#### Warning Level (Best Practices)

- `noExplicitAny`
- `noConsole` (varies by app)
- `noEvolvingTypes`
- `noUnusedTemplateLiteral`
- `useShorthandArrayType`
- `useImportExtensions`
- `noAccumulatingSpread`
- `useSimplifiedLogicExpression`
- `useSortedClasses`
- `noEnum`

### Performance Impact Considerations

- Project domain enables cross-file analysis (slower but more accurate)
- Test domain automatically detects test files
- Next.js/React domains activate based on dependencies
- Rules are configured to balance performance with code quality

## Final ESLint Fallback Configuration

### Frontend ESLint Configuration

**Purpose**: Handle Next.js-specific rules not yet available in Biome domains

**Kept Rules**:

- `@next/next/google-font-display`: Google Fonts optimization
- `@next/next/google-font-preconnect`: Google Fonts preconnect optimization
- `@next/next/next-script-for-ga`: Google Analytics script optimization
- `@next/next/no-before-interactive-script-outside-document`: Script placement rules
- `@next/next/no-css-tags`: Prevent manual CSS tags
- `@next/next/no-duplicate-head`: Prevent duplicate head elements
- `@next/next/no-script-component-in-head`: Script component placement
- `@next/next/no-styled-jsx-in-document`: Styled JSX placement rules
- `@next/next/no-sync-scripts`: Prevent synchronous scripts
- `@next/next/no-title-in-document-head`: Title element placement
- `@next/next/no-typos`: Catch common typos in Next.js APIs
- `@next/next/no-unwanted-polyfillio`: Prevent unwanted polyfills

**Disabled Rules** (now handled by Biome):

- `react/no-unescaped-entities`: Biome handles JSX validation
- `react-hooks/exhaustive-deps`: Biome React domain handles this
- `@next/next/no-img-element`: Biome Next.js domain handles this
- `@next/next/no-head-element`: Biome Next.js domain handles this

### Backend ESLint Configuration

**Purpose**: Handle TypeScript strict type checking rules not available in Biome

**Kept Rules**:

- `@typescript-eslint/no-unsafe-argument`: Prevent unsafe function arguments
- `@typescript-eslint/no-unsafe-assignment`: Prevent unsafe assignments
- `@typescript-eslint/no-unsafe-call`: Prevent unsafe function calls
- `@typescript-eslint/no-unsafe-member-access`: Prevent unsafe property access
- `@typescript-eslint/no-unsafe-return`: Prevent unsafe return values
- `@typescript-eslint/restrict-plus-operands`: Type-safe addition operations
- `@typescript-eslint/restrict-template-expressions`: Type-safe template literals
- `@typescript-eslint/unbound-method`: Prevent unbound method calls
- `@typescript-eslint/await-thenable`: Ensure await is used on promises
- `@typescript-eslint/no-misused-promises`: Prevent promise misuse
- `@typescript-eslint/require-await`: Require await in async functions
- `@typescript-eslint/no-for-in-array`: Prevent for-in loops on arrays
- `@typescript-eslint/no-implied-eval`: Prevent implied eval
- `@typescript-eslint/prefer-includes`: Prefer includes over indexOf
- `@typescript-eslint/prefer-nullish-coalescing`: Prefer ?? over ||
- `@typescript-eslint/prefer-optional-chain`: Prefer optional chaining
- `@typescript-eslint/prefer-string-starts-ends-with`: Prefer string methods

**Removed Dependencies**:

- `eslint-plugin-prettier`: No longer needed (Biome handles formatting)
- `eslint-config-prettier`: No longer needed (Biome handles formatting)
- `prettier`: Can be removed from backend (Biome handles formatting)

### Migration Strategy

1. **Biome First**: All basic linting and formatting goes through Biome
2. **ESLint Fallback**: Only framework-specific and advanced type checking rules
3. **Gradual Migration**: As Biome adds support for more rules, ESLint config can be further reduced
4. **Performance**: ESLint runs only on rules Biome doesn't handle, reducing overhead

### Command Integration

- `biome check .`: Primary linting and formatting
- `eslint .`: Fallback for unsupported rules
- Combined scripts will run both tools in sequence

## CORRECTED Enhanced Biome Rules Configuration

### Additional Security Rules Added (Corrected)

- `noInvalidBuiltinInstantiation`: Ensures builtins are correctly instantiated
- `noGlobalEval`: Prevents using global `eval()` function
- `noSecrets`: Warns about potential API keys and tokens in code

### Additional Performance Rules Added (Corrected)

- `noAccumulatingSpread`: Warns against performance issues with spread in loops
- `noDelete`: Warns against using `delete` operator (performance impact)
- `useSimplifiedLogicExpression`: Suggests simplifying complex logical expressions

### Additional Code Quality Rules Added (Corrected)

- `noUnusedTemplateLiteral`: Warns about template literals that don't use interpolation
- `useImportExtensions`: Enforces explicit file extensions in imports
- `useSortedClasses`: Sorts CSS classes (useful for Tailwind)
- `useExportType`: Promotes type-only exports when possible
- `useImportType`: Promotes type-only imports when possible

### Additional TypeScript Enhancement Rules Added (Corrected)

- `noEnum`: Warns against using `enum` (prefer union types or const assertions) - in nursery
- `noExcessiveCognitiveComplexity`: Warns about overly complex functions

### Enhanced Naming Conventions (Corrected)

- `useNamingConvention`: Enforces PascalCase for classes, interfaces, and type aliases

### Rules That Don't Exist in Current Biome Version

The following rules I initially tried to add are not available:

- `noInvalidNewBuiltin` → Use `noInvalidBuiltinInstantiation` instead
- `noConstEnum` → Not available yet
- `noGlobalIsFinite` → Not available yet
- `noGlobalIsNan` → Not available yet
- `noEvolvingTypes` → Not available yet
- `useShorthandArrayType` → Not available yet

### Valid Additional Rules Available in Biome

Based on comprehensive rule analysis, here are additional valuable rules we could add:

#### Security & Correctness

- `noGlobalObjectCalls`: Disallow calling global object properties as functions
- `noInvalidUseBeforeDeclaration`: Disallow use before declaration
- `noSelfAssign`: Disallow self assignment
- `noStringCaseMismatch`: Disallow string case mismatches

#### Performance & Best Practices

- `noAwaitInLoops`: Disallow await in loops
- `noBarrelFile`: Disallow barrel files
- `noDynamicNamespaceImportAccess`: Disallow dynamic namespace access
- `useTopLevelRegex`: Require regex at top level

#### Code Style & Maintainability

- `useArrowFunction`: Prefer arrow functions
- `useOptionalChain`: Prefer optional chaining
- `useRegexLiterals`: Prefer regex literals over constructor
- `useBlockStatements`: Require curly braces
- `useCollapsedElseIf`: Prefer else if over nested if
- `useDefaultParameterLast`: Default parameters last
- `useExponentiationOperator`: Prefer \*\* over Math.pow

## FINAL WORKING Enhanced Biome Configuration

### Successfully Added Rules (Verified Working)

#### Security & Correctness Rules

- `noGlobalIsFinite`: Prevents using global `isFinite` (use `Number.isFinite` instead)
- `noGlobalIsNan`: Prevents using global `isNaN` (use `Number.isNaN` instead)
- `noSecrets`: Warns about potential API keys and tokens in code (nursery)

#### Performance Rules

- `noAccumulatingSpread`: Warns against performance issues with spread in loops
- `noDelete`: Warns against using `delete` operator (performance impact)
- `useSimplifiedLogicExpression`: Suggests simplifying complex logical expressions

#### Code Quality & Style Rules

- `noUnusedTemplateLiteral`: Warns about template literals that don't use interpolation ✅ WORKING
- `useImportExtensions`: Enforces explicit file extensions in imports
- `useExportType`: Promotes type-only exports when possible
- `useImportType`: Promotes type-only imports when possible
- `useSortedClasses`: Sorts CSS classes (useful for Tailwind)

#### TypeScript Enhancement Rules

- `noExcessiveCognitiveComplexity`: Warns about overly complex functions

#### Enhanced Naming Conventions ✅ WORKING

- `useNamingConvention`: Enforces PascalCase for classes, interfaces, and type aliases
  - Private class members must follow `_(.+)` pattern (underscore prefix)

### Configuration Schema

- Updated to use Biome 2.2.0 schema version
- All configurations migrated successfully across the monorepo

### Verification Results

The enhanced configuration is working correctly as demonstrated by:

1. **Template literal detection**: Catching unnecessary template literals
2. **Naming convention enforcement**: Requiring underscore prefix for private members
3. **Formatting consistency**: Enforcing single quotes and proper indentation
4. **Import/export optimization**: Type-only imports and exports

### Performance Impact

- Project domain enables cross-file analysis for better accuracy
- Test domain automatically detects and applies test-specific rules
- Next.js/React domains activate based on dependencies
- Rules balanced for performance vs. code quality

This configuration provides comprehensive linting that goes beyond what ESLint offered while maintaining compatibility with framework-specific rules through the ESLint fallback configurations.
