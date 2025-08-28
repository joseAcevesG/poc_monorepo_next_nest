import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

// Placeholder test to verify Vitest setup
describe("HelloForm", () => {
	it("should render test placeholder", () => {
		render(<div data-testid="placeholder">Test placeholder</div>);
		expect(screen.getByTestId("placeholder")).toBeInTheDocument();
	});
});
