import type { HelloInput, HelloResponse } from "@monorepo-poc/schemas";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class HelloService {
  private readonly logger = new Logger(HelloService.name);
  /**
   * Process hello input and return world response
   * @param input - Validated hello input
   * @returns HelloResponse with "world" message
   */
  processHello(input: HelloInput): HelloResponse {
    // Business logic: if input is "hello", return "world"
    this.logger.log(`Processing hello input: ${input.input}`);
    this.logger.log(`this is a change on the back`);
    return {
      message: "world",
      success: true,
    };
  }
}
