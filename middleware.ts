
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

// Define protected routes and their required roles
const PROTECTED_ROUTES = [
    { path: "/api/admin", roles: ["ADMIN"] },
    { path: "/api/users", roles: ["USER", "ADMIN"] }, // Example: Users route accessible by both
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if the current path matches any protected route
    const protectedRoute = PROTECTED_ROUTES.find((route) =>
        pathname.startsWith(route.path)
    );

    if (protectedRoute) {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Missing or invalid authorization header" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const payload = await verifyJWT(token);

        if (!payload) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 403 }
            );
        }

        // Check if user has necessary role
        if (!protectedRoute.roles.includes(payload.role)) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }

        // Add user info to headers for downstream access (optional but useful)
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", payload.userId);
        requestHeaders.set("x-user-role", payload.role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Allow other routes to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
