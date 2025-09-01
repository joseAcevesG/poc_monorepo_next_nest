import { describe, expect, it } from "vitest";
import { HelloInputSchema, HelloResponseSchema } from "./hello.schema";

describe("HelloInputSchema", () => {
  describe("valid inputs", () => {
    it('should validate when input is exactly "hello"', () => {
      const validInput = { input: "hello" };
      const result = HelloInputSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validInput);
      }
    });
  });

  describe("invalid inputs", () => {
    it('should fail when input is not "hello"', () => {
      const invalidInput = { input: "world" };
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Input must be exactly 'hello'");
      }
    });

    it("should fail when input is empty string", () => {
      const invalidInput = { input: "" };
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Input must be exactly 'hello'");
      }
    });

    it("should fail when input has different casing", () => {
      const invalidInput = { input: "Hello" };
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Input must be exactly 'hello'");
      }
    });

    it("should fail when input has extra whitespace", () => {
      const invalidInput = { input: " hello " };
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Input must be exactly 'hello'");
      }
    });

    it("should fail when input field is missing", () => {
      const invalidInput = {};
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });

    it("should fail when input is not a string", () => {
      const invalidInput = { input: 123 };
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });

    it("should fail when input is null", () => {
      const invalidInput = { input: null };
      const result = HelloInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });
  });
});

describe("HelloResponseSchema", () => {
  describe("valid responses", () => {
    it("should validate success response", () => {
      const validResponse = {
        message: "world",
        success: true,
      };
      const result = HelloResponseSchema.safeParse(validResponse);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validResponse);
      }
    });

    it("should validate error response", () => {
      const validResponse = {
        message: 'Input must be exactly "hello"',
        success: false,
      };
      const result = HelloResponseSchema.safeParse(validResponse);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validResponse);
      }
    });

    it("should validate with empty message", () => {
      const validResponse = {
        message: "",
        success: true,
      };
      const result = HelloResponseSchema.safeParse(validResponse);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validResponse);
      }
    });
  });

  describe("invalid responses", () => {
    it("should fail when message field is missing", () => {
      const invalidResponse = { success: true };
      const result = HelloResponseSchema.safeParse(invalidResponse);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });

    it("should fail when success field is missing", () => {
      const invalidResponse = { message: "world" };
      const result = HelloResponseSchema.safeParse(invalidResponse);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });

    it("should fail when message is not a string", () => {
      const invalidResponse = {
        message: 123,
        success: true,
      };
      const result = HelloResponseSchema.safeParse(invalidResponse);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });

    it("should fail when success is not a boolean", () => {
      const invalidResponse = {
        message: "world",
        success: "true",
      };
      const result = HelloResponseSchema.safeParse(invalidResponse);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });

    it("should fail when both fields are wrong types", () => {
      const invalidResponse = {
        message: 123,
        success: "false",
      };
      const result = HelloResponseSchema.safeParse(invalidResponse);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
      }
    });
  });
});
