import {
	type HelloInput,
	HelloInputSchema,
	type HelloResponse,
} from "@monorepo-poc/schemas";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { HelloService } from "../services/hello.service";

@Controller("hello")
export class HelloController {
	constructor(private readonly helloService: HelloService) {}

	/**
	 * POST /hello endpoint
	 * Validates input using shared Zod schema and returns "world" for valid "hello" input
	 */
	@Post()
	@UsePipes(new ZodValidationPipe(HelloInputSchema))
	processHello(@Body() input: HelloInput): HelloResponse {
		return this.helloService.processHello(input);
	}
}
