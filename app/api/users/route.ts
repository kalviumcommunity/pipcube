/**
 * RESTful API Route: /api/users
 *
 * This route handles user-related operations for the intercity bus ticket system.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve a list of all users
 * - POST: Create a new user
 *
 * All responses use the global response handler to ensure a consistent shape.
 *
 * @module app/api/users/route
 */

import type { NextRequest } from "next/server";
import type { User, CreateUserRequest } from "@/types/api";
import { getUsers, createUser } from "@/lib/mock-data";
import { validateCreateUser } from "@/lib/validation";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ErrorCodes } from "@/lib/errorCodes";

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
export async function GET() {
  try {
    // Retrieve all users from mock data
    const users = getUsers();

    // Return success response with users data
    return sendSuccess<User[]>(users, "Users fetched successfully", 200);
  } catch (error) {
    // Handle unexpected errors
    return sendError(
      "Failed to retrieve users",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
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
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: unknown = await request.json();

    // Validate the input data
    const validation = validateCreateUser(body);
    if (!validation.isValid) {
      // Return 400 Bad Request if validation fails
      return sendError(
        validation.error || "Validation failed",
        ErrorCodes.VALIDATION_ERROR,
        400
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
    return sendSuccess<User>(
      newUser,
      "User created successfully",
      201
    );
  } catch (error) {
    // Handle JSON parsing errors or other unexpected errors
    if (error instanceof SyntaxError) {
      return sendError(
        "Invalid JSON in request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    return sendError(
      "Failed to create user",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
