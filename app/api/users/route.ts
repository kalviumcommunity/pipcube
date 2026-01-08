/**
 * RESTful API Route: /api/users
 *
 * This route handles user-related operations for the intercity bus ticket system.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve a list of all users
 * - POST: Create a new user
 *
 * @module app/api/users/route
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, User, CreateUserRequest } from "@/types/api";
import { getUsers, createUser } from "@/lib/mock-data";
import { validateCreateUser } from "@/lib/validation";

/**
 * GET /api/users
 *
 * Retrieves a list of all users in the system.
 * This endpoint returns all users without pagination (for simplicity).
 *
 * @returns {Promise<NextResponse>} JSON response containing array of users
 * @status {200} Success - Returns list of users
 *
 * Example response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "1",
 *       "name": "John Doe",
 *       "email": "john.doe@example.com",
 *       "phone": "+1234567890",
 *       "createdAt": "2024-12-15T10:00:00.000Z"
 *     }
 *   ]
 * }
 */
export async function GET(): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    // Retrieve all users from mock data
    const users = getUsers();

    // Return success response with users data
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve users",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 *
 * Creates a new user in the system.
 * Validates input and returns error if validation fails.
 *
 * Request body:
 * {
 *   "name": "string" (required),
 *   "email": "string" (optional),
 *   "phone": "string" (optional)
 * }
 *
 * @param {NextRequest} request - The incoming request containing user data
 * @returns {Promise<NextResponse>} JSON response with created user or error
 * @status {201} Created - User successfully created
 * @status {400} Bad Request - Invalid input data
 *
 * Example success response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "4",
 *     "name": "Alice Brown",
 *     "email": "alice.brown@example.com",
 *     "phone": "+1122334455",
 *     "createdAt": "2024-12-15T10:00:00.000Z"
 *   }
 * }
 *
 * Example error response (400):
 * {
 *   "success": false,
 *   "error": "Name is required and must be a string"
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    // Parse request body
    const body: unknown = await request.json();

    // Validate the input data
    const validation = validateCreateUser(body);
    if (!validation.isValid) {
      // Return 400 Bad Request if validation fails
      return NextResponse.json(
        {
          success: false,
          error: validation.error || "Validation failed",
        },
        { status: 400 }
      );
    }

    // Type assertion after validation
    const userData = body as CreateUserRequest;

    // Create the new user
    const newUser = createUser({
      name: userData.name.trim(),
      email: userData.email?.trim(),
      phone: userData.phone?.trim(),
    });

    // Return success response with created user (201 Created)
    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle JSON parsing errors or other unexpected errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
