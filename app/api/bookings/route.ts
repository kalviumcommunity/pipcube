/**
 * RESTful API Route: /api/bookings
 *
 * This route handles booking-related operations for the intercity bus ticket system.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve bookings with pagination support
 * - POST: Create a new booking
 *
 * @module app/api/bookings/route
 */

import { NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  Booking,
  CreateBookingRequest,
  PaginatedResponse,
} from "@/types/api";
import { getBookings, createBooking, getUserById } from "@/lib/mock-data";
import { validateCreateBooking } from "@/lib/validation";

/**
 * GET /api/bookings
 *
 * Retrieves a paginated list of bookings.
 * Supports query parameters:
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 *
 * @param {NextRequest} request - The incoming request with query parameters
 * @returns {Promise<NextResponse>} JSON response containing paginated bookings
 * @status {200} Success - Returns paginated list of bookings
 *
 * Example request: GET /api/bookings?page=1&limit=10
 *
 * Example response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "1",
 *       "userId": "1",
 *       "route": "New York to Boston",
 *       "departureDate": "2024-12-20",
 *       "departureTime": "10:00 AM",
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
): Promise<NextResponse<PaginatedResponse<Booking>>> {
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
        } as PaginatedResponse<Booking>,
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

    // Get all bookings from mock data
    const allBookings = getBookings();

    // Calculate pagination values
    const total = allBookings.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice the array to get the requested page
    const paginatedBookings = allBookings.slice(startIndex, endIndex);

    // Return success response with paginated data
    return NextResponse.json(
      {
        success: true,
        data: paginatedBookings,
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
        error: "Failed to retrieve bookings",
        message: error instanceof Error ? error.message : "Unknown error",
      } as PaginatedResponse<Booking>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 *
 * Creates a new booking in the system.
 * Validates input and checks if the user exists before creating a booking.
 *
 * Request body:
 * {
 *   "userId": "string" (required),
 *   "route": "string" (required),
 *   "departureDate": "string" (required),
 *   "departureTime": "string" (required),
 *   "seatNumber": "string" (required),
 *   "price": "number" (required, must be positive)
 * }
 *
 * @param {NextRequest} request - The incoming request containing booking data
 * @returns {Promise<NextResponse>} JSON response with created booking or error
 * @status {201} Created - Booking successfully created
 * @status {400} Bad Request - Invalid input data
 * @status {404} Not Found - User not found
 *
 * Example success response (201):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "6",
 *     "userId": "1",
 *     "route": "New York to Philadelphia",
 *     "departureDate": "2024-12-21",
 *     "departureTime": "09:00 AM",
 *     "seatNumber": "F10",
 *     "price": 35.50,
 *     "status": "confirmed",
 *     "createdAt": "2024-12-15T10:00:00.000Z"
 *   },
 *   "message": "Booking created successfully"
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
 *   "error": "User not found"
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    // Parse request body
    const body: unknown = await request.json();

    // Validate the input data
    const validation = validateCreateBooking(body);
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
    const bookingData = body as CreateBookingRequest;

    // Check if user exists (userId validation)
    const user = getUserById(bookingData.userId);
    if (!user) {
      // Return 404 Not Found if user doesn't exist
      return NextResponse.json(
        {
          success: false,
          error: `User with ID "${bookingData.userId}" not found`,
          message:
            "Cannot create booking for a non-existent user. Please create the user first.",
        },
        { status: 404 }
      );
    }

    // Create the new booking
    const newBooking = createBooking({
      userId: bookingData.userId,
      route: bookingData.route.trim(),
      departureDate: bookingData.departureDate.trim(),
      departureTime: bookingData.departureTime.trim(),
      seatNumber: bookingData.seatNumber.trim(),
      price: bookingData.price,
    });

    // Return success response with created booking (201 Created)
    return NextResponse.json(
      {
        success: true,
        data: newBooking,
        message: "Booking created successfully",
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
        error: "Failed to create booking",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
