---
inclusion: always
---

# Product Requirements & Architecture

## Core Application Logic

This monorepo implements a minimal "hello world" validation system with these exact requirements:

- **Input Validation**: Only accept the string "hello" as valid input
- **Response Logic**: Valid input returns "world", invalid input returns validation errors
- **Shared Validation**: Use identical Zod schemas across frontend and backend
- **Error Handling**: Consistent error responses for invalid inputs

## Architecture Principles

### Monorepo Structure

- **Shared Packages First**: All validation logic must originate from `@monorepo-poc/schemas`
- **No Duplication**: Never duplicate validation logic between frontend and backend
- **Workspace Dependencies**: Always use `workspace:*` protocol for internal packages

### API Design

- **Single Endpoint**: POST `/hello` accepts `{ message: string }` and returns `{ response: string }`
- **Validation First**: All inputs must be validated using shared schemas before processing
- **Consistent Responses**: Use same error format across all endpoints

### Frontend Patterns

- **Client-Side Validation**: Validate forms using shared schemas before API calls
- **Error Display**: Show validation errors immediately without server round-trip
- **API Integration**: Use shared types for all API communication

## Implementation Rules

### Validation Flow

1. Import schemas from `@monorepo-poc/schemas` package
2. Use `.safeParse()` for user input validation
3. Use `.parse()` for internal data validation (throws on error)
4. Never bypass schema validation for any user input

### Error Handling

- Frontend: Display validation errors inline with form fields
- Backend: Return 400 status with structured error messages
- Both: Use Zod's built-in error formatting

### Testing Requirements

- Test validation logic in shared schemas package
- Test API endpoints with both valid and invalid inputs
- Test frontend forms with various input scenarios
- Ensure error messages are user-friendly

## Success Metrics

- Zero validation logic duplication between apps
- Consistent error messages across frontend and backend
- Schema changes automatically affect both applications
- Independent deployment without breaking changes
