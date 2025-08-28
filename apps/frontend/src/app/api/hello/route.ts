import { HelloInputSchema, type HelloResponse } from "@monorepo-poc/schemas";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
): Promise<NextResponse<HelloResponse>> {
	try {
		const body = await request.json();

		// Validate request using shared Zod schema
		const result = HelloInputSchema.safeParse(body);

		if (!result.success) {
			const errorMessage = result.error.issues?.[0]?.message || "Invalid input";
			return NextResponse.json(
				{
					message: errorMessage,
					success: false,
				},
				{ status: 400 },
			);
		}

		// If validation passes, return "world"
		return NextResponse.json({
			message: "world",
			success: true,
		});
	} catch {
		return NextResponse.json(
			{
				message: "Invalid JSON",
				success: false,
			},
			{ status: 400 },
		);
	}
}
