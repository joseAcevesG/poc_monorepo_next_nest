import type { HelloResponse } from "@monorepo-poc/schemas";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../lib/api-client";
import HelloForm from "./HelloForm";

// Mock the API client
vi.mock("../lib/api-client", () => ({
  apiClient: {
    sendHello: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(
      message: string,
      public status?: number,
      public response?: HelloResponse,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

describe("HelloForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render the form with all required elements", () => {
      render(<HelloForm />);

      expect(screen.getByText("Hello World Validator")).toBeInTheDocument();
      expect(screen.getByLabelText("Enter your message:")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Type 'hello' here...")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("should have submit button disabled initially", () => {
      render(<HelloForm />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Real-time Validation", () => {
    it("should show error message for invalid input", async () => {
      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");
      await user.type(input, "invalid");

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Input must be exactly 'hello'",
      );
    });

    it("should clear error message for valid input", async () => {
      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");

      // First type invalid input
      await user.type(input, "invalid");
      expect(screen.getByTestId("error-message")).toBeInTheDocument();

      // Clear and type valid input
      await user.clear(input);
      await user.type(input, "hello");

      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("should enable submit button only for valid input", async () => {
      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      // Initially disabled
      expect(submitButton).toBeDisabled();

      // Still disabled for invalid input
      await user.type(input, "invalid");
      expect(submitButton).toBeDisabled();

      // Enabled for valid input
      await user.clear(input);
      await user.type(input, "hello");
      expect(submitButton).not.toBeDisabled();
    });

    it("should show error styling on input field when invalid", async () => {
      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");

      await user.type(input, "invalid");

      expect(input).toHaveClass("border-red-500");
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit handler with correct data", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue({
        message: "world",
        success: true,
      } as HelloResponse);

      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({ input: "hello" });
    });

    it("should display success response", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue({
        message: "world",
        success: true,
      } as HelloResponse);

      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("response-message")).toHaveTextContent("world");
      });
    });

    it("should display error response", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue({
        message: "Validation failed",
        success: false,
      } as HelloResponse);

      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("response-message")).toHaveTextContent("Validation failed");
      });
    });

    it("should show loading state during submission", async () => {
      const mockOnSubmit = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  message: "world",
                  success: true,
                }),
              100,
            ),
          ),
      );

      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      expect(submitButton).toHaveTextContent("Submitting...");
      expect(submitButton).toBeDisabled();
      expect(input).toBeDisabled();

      await waitFor(() => {
        expect(submitButton).toHaveTextContent("Submit");
      });
    });

    it("should handle submission errors", async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent("Network error");
      });
    });

    it("should prevent submission with invalid input", async () => {
      const mockOnSubmit = vi.fn();
      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");

      await user.type(input, "invalid");

      // Try to submit by pressing Enter
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should clear previous response when input changes", async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue({
        message: "world",
        success: true,
      } as HelloResponse);

      const user = userEvent.setup();
      render(<HelloForm onSubmit={mockOnSubmit} />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      // Submit and get response
      await user.type(input, "hello");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("response-message")).toBeInTheDocument();
      });

      // Change input
      await user.type(input, "x");

      expect(screen.queryByTestId("response-message")).not.toBeInTheDocument();
    });
  });

  describe("API Integration", () => {
    it("should make API call when no onSubmit handler provided", async () => {
      const { apiClient } = await import("../lib/api-client");
      const mockSendHello = vi.mocked(apiClient.sendHello);
      mockSendHello.mockResolvedValue({
        message: "world",
        success: true,
      });

      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      expect(mockSendHello).toHaveBeenCalledWith({ input: "hello" });

      await waitFor(() => {
        expect(screen.getByTestId("response-message")).toHaveTextContent("world");
      });
    });

    it("should handle API errors", async () => {
      const { apiClient } = await import("../lib/api-client");
      const mockSendHello = vi.mocked(apiClient.sendHello);
      mockSendHello.mockRejectedValue(new ApiError("Backend error", 400));

      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent("Backend error");
      });
    });

    it("should handle API errors with structured response", async () => {
      const { apiClient } = await import("../lib/api-client");
      const mockSendHello = vi.mocked(apiClient.sendHello);
      const errorResponse: HelloResponse = {
        message: "Validation failed",
        success: false,
      };
      mockSendHello.mockRejectedValue(new ApiError("Validation failed", 400, errorResponse));

      const user = userEvent.setup();
      render(<HelloForm />);

      const input = screen.getByTestId("hello-input");
      const submitButton = screen.getByTestId("submit-button");

      await user.type(input, "hello");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("response-message")).toHaveTextContent("Validation failed");
      });
    });
  });
});
