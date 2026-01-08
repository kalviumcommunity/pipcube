/**
 * RESTful API Route: /api/refunds
 *
 * This route handles refund-related operations for the intercity bus ticket system.
 * It provides transparency on refund amounts, eligibility, and processing timelines.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve refunds with pagination support
 * - POST: Process a refund for an approved cancellation
 *
 * @module app/api/refunds/route
 */

import { NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  Refund,
  CreateRefundRequest,
  PaginatedResponse,
} from "@/types/api";
import {
  getRefunds,
  createRefund,
  getCancellationById,
} from "@/lib/mock-data";
import { validateCreateRefund } from "@/lib/validation";

/**
 * GET /api/refunds
 *
 * Retrieves a paginated list of refunds.
 * Supports query parameters:
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 * - userId: Optional filter by user ID
 * - status: Optional filter by refund status
 *
 * @param {NextRequest} request - The incoming request with query parameters
 * @returns {Promise<NextResponse>} JSON response containing paginated refunds
 * @status {200} Success - Returns paginated list of refunds
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Refund>>> {
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
        } as PaginatedResponse<Refund>,
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
    const statusParam = searchParams.get("status");

    let allRefunds = getRefunds();

    if (userIdParam) {
      allRefunds = allRefunds.filter((refund) => refund.userId === userIdParam);
    }
    if (statusParam) {
      allRefunds = allRefunds.filter((refund) => refund.status === statusParam);
    }

    const total = allRefunds.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedRefunds = allRefunds.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        success: true,
        data: paginatedRefunds,
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
        error: "Failed to retrieve refunds",
        message: error instanceof Error ? error.message : "Unknown error",
      } as PaginatedResponse<Refund>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/refunds
 *
 * Processes a refund for an approved cancellation.
 * Validates that the cancellation exists, is eligible for refund, and hasn't been refunded already.
 *
 * Request body:
 * {
 *   "cancellationId": "string" (required)
 * }
 *
 * @param {NextRequest} request - The incoming request containing refund data
 * @returns {Promise<NextResponse>} JSON response with created refund or error
 * @status {201} Created - Refund successfully processed
 * @status {400} Bad Request - Invalid input or cancellation not eligible
 * @status {404} Not Found - Cancellation not found
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Refund>>> {
  try {
    const body: unknown = await request.json();

    const validation = validateCreateRefund(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || "Validation failed",
        },
        { status: 400 }
      );
    }

    const refundData = body as CreateRefundRequest;

    // Check if cancellation exists
    const cancellation = getCancellationById(refundData.cancellationId);
    if (!cancellation) {
      return NextResponse.json(
        {
          success: false,
          error: `Cancellation with ID "${refundData.cancellationId}" not found`,
        },
        { status: 404 }
      );
    }

    // Check if cancellation is eligible for refund
    if (!cancellation.refundEligibility) {
      return NextResponse.json(
        {
          success: false,
          error: "This cancellation is not eligible for refund based on the cancellation policy",
        },
        { status: 400 }
      );
    }

    // Check if cancellation is processed
    if (cancellation.status !== "processed") {
      return NextResponse.json(
        {
          success: false,
          error: "Cancellation must be processed before refund can be initiated",
        },
        { status: 400 }
      );
    }

    // Check if refund already exists for this cancellation
    const existingRefunds = getRefunds();
    const existingRefund = existingRefunds.find(
      (r) => r.cancellationId === refundData.cancellationId
    );
    if (existingRefund) {
      return NextResponse.json(
        {
          success: false,
          error: "Refund already exists for this cancellation",
          data: existingRefund,
        },
        { status: 400 }
      );
    }

    // Create the refund
    const newRefund = createRefund({
      cancellationId: cancellation.id,
      ticketId: cancellation.ticketId,
      userId: cancellation.userId,
      originalAmount: cancellation.refundAmount || 0,
      refundAmount: cancellation.refundAmount || 0,
      reason: cancellation.reason,
    });

    return NextResponse.json(
      {
        success: true,
        data: newRefund,
        message: "Refund processed successfully",
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
        error: "Failed to process refund",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
