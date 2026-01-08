/**
 * RESTful API Route: /api/tickets
 *
 * This route handles ticket-related operations for the intercity bus ticket cancellation and refund system.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve tickets with pagination support
 * - POST: Create a new ticket (booking)
 *
 * All responses use the global response handler to ensure a consistent shape.
 *
 * @module app/api/tickets/route
 */

import type { NextRequest } from "next/server";
import type { Ticket } from "@/types/api";
import { getTickets, createTicket, getUserById, getTripById } from "@/lib/mock-data";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ErrorCodes } from "@/lib/errorCodes";
import { createTicketSchema } from "@/lib/schemas/ticketSchema";
import { formatZodError } from "@/lib/schemas/zodErrorFormatter";
import { ZodError } from "zod";

/**
 * GET /api/tickets
 *
 * Retrieves a paginated list of tickets.
 * Supports query parameters:
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 * - userId: Optional filter by user ID
 *
 * @param {NextRequest} request - The incoming request with query parameters
 * @returns {Promise<NextResponse>} JSON response containing paginated tickets
 * @status {200} Success - Returns paginated list of tickets
 *
 * Example request: GET /api/tickets?page=1&limit=10&userId=1
 *
 * Example response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "1",
 *       "userId": "1",
 *       "tripId": "1",
 *       "seatNumber": "A12",
 *       "price": 45.99,
 *       "status": "confirmed",
 *       "createdAt": "2024-12-15T10:00:00.000Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "total": 25,
 *     "totalPages": 3
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    // Parse and validate page parameter (default: 1, minimum: 1)
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    if (isNaN(page) || page < 1) {
      return sendError(
        "Invalid page parameter. Must be a positive integer.",
        ErrorCodes.VALIDATION_ERROR,
        400,
        { page: pageParam }
      );
    }

    // Parse and validate limit parameter (default: 10, max: 100, minimum: 1)
    let limit = limitParam ? parseInt(limitParam, 10) : 10;
    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }
    if (limit > 100) {
      limit = 100; // Cap at 100 to prevent performance issues
    }

    // Get filter parameter
    const userIdParam = searchParams.get("userId");

    // Get all tickets from mock data
    let allTickets = getTickets();

    // Filter by userId if provided
    if (userIdParam) {
      allTickets = allTickets.filter((ticket) => ticket.userId === userIdParam);
    }

    // Calculate pagination values
    const total = allTickets.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice the array to get the requested page
    const paginatedTickets = allTickets.slice(startIndex, endIndex);

    // Return success response with paginated data
    return sendSuccess(
      {
        items: paginatedTickets,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      "Tickets fetched successfully",
      200
    );
  } catch (error) {
    // Handle unexpected errors
    return sendError(
      "Failed to retrieve tickets",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

/**
 * POST /api/tickets
 *
 * Creates a new ticket in the system.
 * Validates input and checks if the user and trip exist before creating a ticket.
 *
 * Request body:
 * {
 *   "userId": "string" (required),
 *   "tripId": "string" (required),
 *   "seatNumber": "string" (required)
 * }
 *
 * @param {NextRequest} request - The incoming request containing ticket data
 * @returns {Promise<NextResponse>} JSON response with created ticket or error
 * @status {201} Created - Ticket successfully created
 * @status {400} Bad Request - Invalid input data
 * @status {404} Not Found - User or trip not found
 *
 * Example success response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "6",
 *     "userId": "1",
 *     "tripId": "1",
 *     "seatNumber": "F10",
 *     "price": 35.50,
 *     "status": "confirmed",
 *     "createdAt": "2024-12-15T10:00:00.000Z"
 *   },
 *   "message": "Ticket created successfully"
 * }
 *
 * Example error response (400):
 * {
 *   "success": false,
 *   "error": "userId is required and must be a string"
 * }
 *
 * Example error response (404):
 * {
 *   "success": false,
 *   "error": "User with ID \"999\" not found"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: unknown = await request.json();

    // Validate the input data using Zod schema
    // schema.parse() will throw ZodError if validation fails
    const validatedData = createTicketSchema.parse(body);

    // Check if user exists
    const user = getUserById(validatedData.userId);
    if (!user) {
      // Return 404 Not Found if user doesn't exist
      return sendError(
        `User with ID "${validatedData.userId}" not found`,
        ErrorCodes.NOT_FOUND,
        404,
        "Cannot create ticket for a non-existent user. Please create the user first."
      );
    }

    // Check if trip exists
    const trip = getTripById(validatedData.tripId);
    if (!trip) {
      // Return 404 Not Found if trip doesn't exist
      return sendError(
        `Trip with ID "${validatedData.tripId}" not found`,
        ErrorCodes.NOT_FOUND,
        404,
        "Cannot create ticket for a non-existent trip."
      );
    }

    // Create the new ticket with validated data
    // Zod ensures all fields are properly typed and validated
    const newTicket = createTicket({
      userId: validatedData.userId,
      tripId: validatedData.tripId,
      seatNumber: validatedData.seatNumber,
      price: trip.price, // Price comes from the trip
    });

    // Return success response with created ticket (201 Created)
    return sendSuccess<Ticket>(
      newTicket,
      "Ticket created successfully",
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
      "Failed to create ticket",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
