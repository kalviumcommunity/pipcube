/**
 * Protected API Route: /api/users
 *
 * This route demonstrates a JWT-protected endpoint.
 * Only authenticated users with a valid token can access it.
 *
 * Authentication:
 * - Expects JWT in Authorization header
 *   Format: Authorization: Bearer <token>
 */

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    // 1. Read Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header missing",
        },
        { status: 401 }
      );
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token missing",
        },
        { status: 401 }
      );
    }

    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Return protected data
    return NextResponse.json(
      {
        success: true,
        message: "Access granted to protected users route",
        user: decoded,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      { status: 403 }
    );
  }
}
