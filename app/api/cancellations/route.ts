/**
 * RESTful API Route: /api/cancellations
 *
 * This route handles cancellation-related operations for the intercity bus ticket system.
 * It provides transparency and accountability for ticket cancellations.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve cancellations with pagination support
 * - POST: Create a new cancellation request
 *
 * @module app/api/cancellations/route
 */

import { NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  Cancellation,
  CreateCancellationRequest,
  PaginatedResponse,
} from "@/types/api";
import {
  getCancellations,
  createCancellation,
  getTicketById,
  calculateRefundEligibility,
} from "@/lib/mock-data";
import { validateCreateCancellation } from "@/lib/validation";

/**
 * GET /api/cancellations
 *
 * Retrieves a paginated list of cancellations.
 * Supports query parameters:
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 * - userId: Optional filter by user ID
 * - ticketId: Optional filter by ticket ID
 *
 * @param {NextRequest} request - The incoming request with query parameters
 * @returns {Promise<NextResponse>} JSON response containing paginated cancellations
 * @status {200} Success - Returns paginated list of cancellations
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Cancellation>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

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
        } as PaginatedResponse<Cancellation>,
        { status: 400 }
      );
    }

    let limit = limitParam ? parseInt(limitParam, 10) : 10;
    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }
    if (limit > 100) {
      limit = 100;
    }

    const userIdParam = searchParams.get("userId");
    const ticketIdParam = searchParams.get("ticketId");

    let allCancellations = getCancellations();

    if (userIdParam) {
      allCancellations = allCancellations.filter(
        (cancellation) => cancellation.userId === userIdParam
      );
    }
    if (ticketIdParam) {
      allCancellations = allCancellations.filter(
        (cancellation) => cancellation.ticketId === ticketIdParam
      );
    }

    const total = allCancellations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCancellations = allCancellations.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        success: true,
        data: paginatedCancellations,
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
        error: "Failed to retrieve cancellations",
        message: error instanceof Error ? error.message : "Unknown error",
      } as PaginatedResponse<Cancellation>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/cancellations
 *
 * Creates a new cancellation request in the system.
 * Validates input, checks if ticket exists, and calculates refund eligibility
 * based on cancellation policy.
 *
 * Request body:
 * {
 *   "ticketId": "string" (required),
 *   "reason": "string" (required)
 * }
 *
 * @param {NextRequest} request - The incoming request containing cancellation data
 * @returns {Promise<NextResponse>} JSON response with created cancellation or error
 * @status {201} Created - Cancellation request successfully created
 * @status {400} Bad Request - Invalid input data or ticket already cancelled
 * @status {404} Not Found - Ticket not found
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Cancellation>>> {
  try {
    const body: unknown = await request.json();

    const validation = validateCreateCancellation(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || "Validation failed",
        },
        { status: 400 }
      );
    }

    const cancellationData = body as CreateCancellationRequest;

    // Check if ticket exists
    const ticket = getTicketById(cancellationData.ticketId);
    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: `Ticket with ID "${cancellationData.ticketId}" not found`,
        },
        { status: 404 }
      );
    }

    // Check if ticket is already cancelled
    if (ticket.status === "cancelled") {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket is already cancelled",
        },
        { status: 400 }
      );
    }

    // Calculate refund eligibility based on cancellation policy
    const refundInfo = calculateRefundEligibility(ticket.id);

    // Create the cancellation
    const newCancellation = createCancellation({
      ticketId: cancellationData.ticketId,
      userId: ticket.userId,
      reason: cancellationData.reason.trim(),
      cancelledBy: "user",
      cancellationPolicy: refundInfo.policy,
      refundEligibility: refundInfo.eligible,
      refundAmount: refundInfo.amount,
    });

    return NextResponse.json(
      {
        success: true,
        data: newCancellation,
        message: "Cancellation request created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
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
        error: "Failed to create cancellation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
