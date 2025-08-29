import type { HelloInput } from "@monorepo-poc/schemas";
import { Test, type TestingModule } from "@nestjs/testing";
import { HelloService } from "./hello.service";

describe("HelloService", () => {
	let service: HelloService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [HelloService],
		}).compile();

		service = module.get<HelloService>(HelloService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("processHello", () => {
		it("should return world response for hello input", () => {
			const input: HelloInput = { input: "hello" };
			const result = service.processHello(input);

			expect(result).toEqual({
				message: "world",
				success: true,
			});
		});

		it("should return success true for valid input", () => {
			const input: HelloInput = { input: "hello" };
			const result = service.processHello(input);

			expect(result.success).toBe(true);
		});

		it("should return world message for valid input", () => {
			const input: HelloInput = { input: "hello" };
			const result = service.processHello(input);

			expect(result.message).toBe("world");
		});
	});
});
