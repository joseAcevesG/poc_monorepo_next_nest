import { z } from "zod";

/**
 * Schema for validating hello input
 * Ensures the input field contains exactly "hello"
 */
export const HelloInputSchema = z.object({
  input: z.string().refine((val) => val === "hello", {
    message: "Input must be exactly 'hello'",
  }),
});

/**
 * Schema for validating hello response
 * Defines the structure of API responses
 */
export const HelloResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

/**
 * Type definitions derived from schemas
 */
export type HelloInput = z.infer<typeof HelloInputSchema>;
export type HelloResponse = z.infer<typeof HelloResponseSchema>;
