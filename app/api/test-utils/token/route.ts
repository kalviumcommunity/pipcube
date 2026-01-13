import { NextResponse } from "next/server";
import { signJWT } from "@/lib/auth";

export async function GET() {
    // DEV ONLY: Generate tokens for testing
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
    }

    const adminToken = await signJWT({ userId: "1", email: "admin@example.com", role: "ADMIN" });
    const userToken = await signJWT({ userId: "2", email: "user@example.com", role: "USER" });

    return NextResponse.json({
        adminToken,
        userToken
    });
}
