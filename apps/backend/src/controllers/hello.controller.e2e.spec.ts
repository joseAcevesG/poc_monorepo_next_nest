import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { HelloService } from "../services/hello.service";
import { HelloController } from "./hello.controller";
import { expect, it, afterEach, beforeEach, describe } from "vitest";

describe("HelloController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [HelloController],
			providers: [HelloService],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	describe("POST /hello", () => {
		it("should return world response for valid hello input", () => {
			return request(app.getHttpServer())
				.post("/hello")
				.send({ input: "hello" })
				.expect(201)
				.expect({
					message: "world",
					success: true,
				});
		});

		it("should return 400 for invalid input", () => {
			return request(app.getHttpServer())
				.post("/hello")
				.send({ input: "invalid" })
				.expect(400)
				.expect((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe("Validation failed");
					expect(res.body.errors).toBeDefined();
					expect(res.body.errors[0].message).toBe(
						"Input must be exactly 'hello'",
					);
				});
		});

		it("should return 400 for missing input field", () => {
			return request(app.getHttpServer())
				.post("/hello")
				.send({})
				.expect(400)
				.expect((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe("Validation failed");
					expect(res.body.errors).toBeDefined();
				});
		});

		it("should return 400 for non-string input", () => {
			return request(app.getHttpServer())
				.post("/hello")
				.send({ input: 123 })
				.expect(400)
				.expect((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe("Validation failed");
					expect(res.body.errors).toBeDefined();
				});
		});

		it("should return 400 for empty string input", () => {
			return request(app.getHttpServer())
				.post("/hello")
				.send({ input: "" })
				.expect(400)
				.expect((res) => {
					expect(res.body.success).toBe(false);
					expect(res.body.message).toBe("Validation failed");
					expect(res.body.errors).toBeDefined();
					expect(res.body.errors[0].message).toBe(
						"Input must be exactly 'hello'",
					);
				});
		});
	});
});
