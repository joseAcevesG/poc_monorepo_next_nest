"use client";

import { type HelloInput, HelloInputSchema, type HelloResponse } from "@monorepo-poc/schemas";
import type React from "react";
import { useId, useState } from "react";
import { ApiError, apiClient } from "../lib/api-client";

interface HelloFormProps {
  onSubmit?: (data: HelloInput) => Promise<HelloResponse>;
}

export default function HelloForm({ onSubmit }: HelloFormProps) {
  const inputId = useId();
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<HelloResponse | null>(null);

  // Real-time validation
  const validateInput = (value: string): string => {
    const result = HelloInputSchema.safeParse({ input: value });
    if (!result.success) {
      return result.error.issues?.[0]?.message || "Invalid input";
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInput(value);

    // Real-time validation feedback
    const validationError = validateInput(value);
    setError(validationError);

    // Clear previous response when input changes
    if (response) {
      setResponse(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate before submission
    const validationError = validateInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data: HelloInput = { input };

      if (onSubmit) {
        // Use provided onSubmit handler (for testing or custom API calls)
        const result = await onSubmit(data);
        setResponse(result);
      } else {
        // Call backend API using API client
        const result = await apiClient.sendHello(data);
        setResponse(result);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle API-specific errors
        setError(err.message);
        // If the API returned a structured response, use it
        if (err.response && !err.response.success) {
          setResponse(err.response);
        }
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = input.length > 0 && error === "";

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Hello World Validator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            Enter your message:
          </label>
          <input
            id={inputId}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type 'hello' here..."
            className={`w-full px-3 py-2  border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
            data-testid="hello-input"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600" data-testid="error-message">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isValid && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          data-testid="submit-button"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {response && (
        <div
          className={`mt-4 p-3 rounded-md ${
            response.success
              ? "bg-green-100 border border-green-300"
              : "bg-red-100 border border-red-300"
          }`}
          data-testid="response-message"
        >
          <p
            className={`text-sm font-medium ${
              response.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {response.message}
          </p>
        </div>
      )}
    </div>
  );
}
