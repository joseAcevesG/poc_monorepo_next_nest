import { HelloInputSchema } from '@monorepo-poc/schemas';
import { describe, expect, it } from 'vitest';

describe('Shared schemas integration', () => {
  it('should import and use shared HelloInputSchema', () => {
    const validInput = { input: 'hello' };
    const result = HelloInputSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it('should reject invalid input using shared schema', () => {
    const invalidInput = { input: 'world' };
    const result = HelloInputSchema.safeParse(invalidInput);

    expect(result.success).toBe(false);
  });
});
