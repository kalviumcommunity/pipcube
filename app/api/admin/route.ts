import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return NextResponse.json({
        success: true,
        message: "Welcome to the Admin Dashboard",
        secretData: "This data is only for admins."
    });
}
