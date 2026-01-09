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

import type { NextRequest } from "next/server";
import type { User } from "@/types/api";
import { getUsers, createUser } from "@/lib/mock-data";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ErrorCodes } from "@/lib/errorCodes";
import { createUserSchema } from "@/lib/schemas/userSchema";
import { formatZodError } from "@/lib/schemas/zodErrorFormatter";
import { ZodError } from "zod";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    // 1. Read Authorization header
    const authHeader = req.headers.get("authorization");

    // Validate the input data using Zod schema
    // schema.parse() will throw ZodError if validation fails
    const validatedData = createUserSchema.parse(body);

    // Create the new user with validated data
    // Zod ensures all fields are properly typed and validated
    const newUser = createUser({
      name: validatedData.name,
      email: validatedData.email || undefined,
      phone: validatedData.phone || undefined,
    });

    // Return success response with created user (201 Created)
    return sendSuccess<User>(
      newUser,
      "User created successfully",
      201
    );
  } catch (error) {
    // Handle Zod validation errors explicitly
    if (error instanceof ZodError) {
      // Format Zod errors into structured array
      const validationErrors = formatZodError(error);
      
      return sendError(
        "Validation Error",
        ErrorCodes.VALIDATION_ERROR,
        400,
        {
          errors: validationErrors,
        }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return sendError(
        "Invalid JSON in request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Handle unexpected errors
    return sendError(
      "Failed to create user",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
