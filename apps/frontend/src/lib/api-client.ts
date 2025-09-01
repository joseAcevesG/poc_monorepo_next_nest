import type { HelloInput, HelloResponse } from "@monorepo-poc/schemas";

/**
 * API client configuration
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  timeout: 10000, // 10 seconds
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: HelloResponse,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API client for backend communication
 */
export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new ApiError(
          `Invalid response format: expected JSON, got ${contentType}`,
          response.status,
        );
      }

      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data,
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout errors
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout - please try again");
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiError("Network error - please check your connection and try again");
      }

      // Re-throw API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle unknown errors
      throw new ApiError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  }

  /**
   * Send hello request to backend API
   */
  async sendHello(input: HelloInput): Promise<HelloResponse> {
    return this.makeRequest<HelloResponse>("/hello", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  /**
   * Health check endpoint (optional)
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>("/health");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
