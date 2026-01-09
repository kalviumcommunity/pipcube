
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

// Define protected routes and their required roles
const PROTECTED_ROUTES = [
    { path: "/api/admin", roles: ["ADMIN"] },
    { path: "/api/users", roles: ["USER", "ADMIN"] },
    { path: "/dashboard", roles: ["USER", "ADMIN"] },
    { path: "/users", roles: ["USER", "ADMIN"] },
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if the current path matches any protected route
    const protectedRoute = PROTECTED_ROUTES.find((route) =>
        pathname.startsWith(route.path)
    );

    if (protectedRoute) {
        // Determine context (API or Page)
        const isApi = pathname.startsWith("/api");

        let token: string | undefined;

        if (isApi) {
            const authHeader = req.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        } else {
            // For pages, check cookies
            const tokenCookie = req.cookies.get("token");
            token = tokenCookie?.value;
        }

        if (!token) {
            if (isApi) {
                return NextResponse.json(
                    { error: "Missing or invalid authorization header" },
                    { status: 401 }
                );
            } else {
                // Redirect pages to login
                const url = req.nextUrl.clone();
                url.pathname = "/login";
                url.searchParams.set("callbackUrl", pathname);
                return NextResponse.redirect(url);
            }
        }

        const payload = await verifyJWT(token);

        if (!payload) {
            if (isApi) {
                return NextResponse.json(
                    { error: "Invalid or expired token" },
                    { status: 403 }
                );
            } else {
                // Redirect pages to login (token invalid)
                const url = req.nextUrl.clone();
                url.pathname = "/login";
                return NextResponse.redirect(url);
            }
        }

        // Check if user has necessary role
        if (!protectedRoute.roles.includes(payload.role)) {
            if (isApi) {
                return NextResponse.json(
                    { error: "Insufficient permissions" },
                    { status: 403 }
                );
            } else {
                // For pages, maybe a 403 page or redirect to dashboard
                // For now, let's redirect to dashboard with an error param? 
                // Or just let them pass if we are lazy? No, must protect.
                // Let's Rewrite to a "Access Denied" page or just standard error response?
                // Next.js middleware `rewrite` is useful here.
                return NextResponse.rewrite(new URL('/403', req.url));
                // (Assuming we create a 403 page or not-found handles it? 
                //  Actually simplest is redirect to home or 404)
            }
        }

        // Add user info to headers for downstream access
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
    // Match API routes AND protected pages
    matcher: ["/api/:path*", "/dashboard/:path*", "/users/:path*"],
};
