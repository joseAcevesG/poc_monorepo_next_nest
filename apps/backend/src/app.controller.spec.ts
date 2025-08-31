import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
	let appController: AppController;
	let appService: AppService;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
		appService = app.get<AppService>(AppService);
	});

	describe("root", () => {
		it("should have appService defined", () => {
			expect(appService).toBeDefined();
			expect(appService.getHello()).toBe("Hello World!");
		});

		it("should work with manual instantiation", () => {
			const service = new AppService();
			const controller = new AppController(service);
			expect(controller.getHello()).toBe("Hello World!");
		});
	});

	describe("health", () => {
		it("should return health status", () => {
			const result = appController.getHealth();
			expect(result).toHaveProperty("status", "ok");
			expect(result).toHaveProperty("timestamp");
			expect(typeof result.timestamp).toBe("string");
		});
	});
});
