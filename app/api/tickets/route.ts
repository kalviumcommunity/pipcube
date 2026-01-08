/**
 * RESTful API Route: /api/tickets
 *
 * This route handles ticket-related operations for the intercity bus ticket cancellation and refund system.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve tickets with pagination support
 * - POST: Create a new ticket (booking)
 *
 * @module app/api/tickets/route
 */

import { NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  Ticket,
  CreateTicketRequest,
  PaginatedResponse,
} from "@/types/api";
import { getTickets, createTicket, getUserById, getTripById } from "@/lib/mock-data";
import { validateCreateTicket } from "@/lib/validation";

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
export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Ticket>>> {
  try {
    // Get query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    // Parse and validate page parameter (default: 1, minimum: 1)
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
          error: "Invalid page parameter. Must be a positive integer.",
        } as PaginatedResponse<Ticket>,
        { status: 400 }
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
    return NextResponse.json(
      {
        success: true,
        data: paginatedTickets,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        error: "Failed to retrieve tickets",
        message: error instanceof Error ? error.message : "Unknown error",
      } as PaginatedResponse<Ticket>,
      { status: 500 }
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
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Ticket>>> {
  try {
    // Parse request body
    const body: unknown = await request.json();

    // Validate the input data
    const validation = validateCreateTicket(body);
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
    const ticketData = body as CreateTicketRequest;

    // Check if user exists
    const user = getUserById(ticketData.userId);
    if (!user) {
      // Return 404 Not Found if user doesn't exist
      return NextResponse.json(
        {
          success: false,
          error: `User with ID "${ticketData.userId}" not found`,
          message:
            "Cannot create ticket for a non-existent user. Please create the user first.",
        },
        { status: 404 }
      );
    }

    // Check if trip exists
    const trip = getTripById(ticketData.tripId);
    if (!trip) {
      // Return 404 Not Found if trip doesn't exist
      return NextResponse.json(
        {
          success: false,
          error: `Trip with ID "${ticketData.tripId}" not found`,
          message: "Cannot create ticket for a non-existent trip.",
        },
        { status: 404 }
      );
    }

    // Create the new ticket
    const newTicket = createTicket({
      userId: ticketData.userId,
      tripId: ticketData.tripId,
      seatNumber: ticketData.seatNumber.trim(),
      price: trip.price, // Price comes from the trip
    });

    // Return success response with created ticket (201 Created)
    return NextResponse.json(
      {
        success: true,
        data: newTicket,
        message: "Ticket created successfully",
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
        error: "Failed to create ticket",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
