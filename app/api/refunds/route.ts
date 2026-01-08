/**
 * RESTful API Route: /api/refunds
 *
 * This route handles refund-related operations for the intercity bus ticket system.
 * It provides transparency on refund amounts, eligibility, and processing timelines.
 * It follows REST conventions using HTTP methods:
 * - GET: Retrieve refunds with pagination support
 * - POST: Process a refund for an approved cancellation
 *
 * All responses use the global response handler to ensure a consistent shape.
 *
 * @module app/api/refunds/route
 */

import type { NextRequest } from "next/server";
import type {
  ApiResponse,
  Refund,
  CreateRefundRequest,
} from "@/types/api";
import {
  getRefunds,
  createRefund,
  getCancellationById,
} from "@/lib/mock-data";
import { validateCreateRefund } from "@/lib/validation";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ErrorCodes } from "@/lib/errorCodes";

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
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    if (isNaN(page) || page < 1) {
      return sendError(
        "Invalid page parameter. Must be a positive integer.",
        ErrorCodes.VALIDATION_ERROR,
        400,
        { page: pageParam }
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

    return sendSuccess(
      {
        items: paginatedRefunds,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      "Refunds fetched successfully",
      200
    );
  } catch (error) {
    return sendError(
      "Failed to retrieve refunds",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
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
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    const validation = validateCreateRefund(body);
    if (!validation.isValid) {
      return sendError(
        validation.error || "Validation failed",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    const refundData = body as CreateRefundRequest;

    // Check if cancellation exists
    const cancellation = getCancellationById(refundData.cancellationId);
    if (!cancellation) {
      return sendError(
        `Cancellation with ID "${refundData.cancellationId}" not found`,
        ErrorCodes.NOT_FOUND,
        404
      );
    }

    // Check if cancellation is eligible for refund
    if (!cancellation.refundEligibility) {
      return sendError(
        "This cancellation is not eligible for refund based on the cancellation policy",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Check if cancellation is processed
    if (cancellation.status !== "processed") {
      return sendError(
        "Cancellation must be processed before refund can be initiated",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Check if refund already exists for this cancellation
    const existingRefunds = getRefunds();
    const existingRefund = existingRefunds.find(
      (r) => r.cancellationId === refundData.cancellationId
    );
    if (existingRefund) {
      return sendError(
        "Refund already exists for this cancellation",
        ErrorCodes.VALIDATION_ERROR,
        400,
        existingRefund
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

    return sendSuccess<Refund>(
      newRefund,
      "Refund processed successfully",
      201
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return sendError(
        "Invalid JSON in request body",
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    return sendError(
      "Failed to process refund",
      ErrorCodes.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
