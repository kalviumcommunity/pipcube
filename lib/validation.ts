// Validation utilities for API requests

import type {
  CreateUserRequest,
  CreateTicketRequest,
  CreateCancellationRequest,
  CreateRefundRequest,
} from "@/types/api";

/**
 * Validates a create user request
 * @param data - The user data to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateCreateUser(
  data: unknown
): { isValid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid request body" };
  }

  const userData = data as Partial<CreateUserRequest>;

  // Name is required
  if (!userData.name || typeof userData.name !== "string") {
    return { isValid: false, error: "Name is required and must be a string" };
  }

  // Trim and check if name is empty
  if (userData.name.trim().length === 0) {
    return { isValid: false, error: "Name cannot be empty" };
  }

  // Optional email validation
  if (userData.email && typeof userData.email !== "string") {
    return { isValid: false, error: "Email must be a string" };
  }

  // Optional phone validation
  if (userData.phone && typeof userData.phone !== "string") {
    return { isValid: false, error: "Phone must be a string" };
  }

  return { isValid: true };
}

/**
 * Validates a create ticket request
 * @param data - The ticket data to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateCreateTicket(
  data: unknown
): { isValid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid request body" };
  }

  const ticketData = data as Partial<CreateTicketRequest>;

  // userId is required
  if (!ticketData.userId || typeof ticketData.userId !== "string") {
    return {
      isValid: false,
      error: "userId is required and must be a string",
    };
  }

  // tripId is required
  if (!ticketData.tripId || typeof ticketData.tripId !== "string") {
    return {
      isValid: false,
      error: "tripId is required and must be a string",
    };
  }

  // seatNumber is required
  if (!ticketData.seatNumber || typeof ticketData.seatNumber !== "string") {
    return {
      isValid: false,
      error: "seatNumber is required and must be a string",
    };
  }

  // Validate seat number format (e.g., A12, B5, etc.)
  if (ticketData.seatNumber.trim().length === 0) {
    return {
      isValid: false,
      error: "seatNumber cannot be empty",
    };
  }

  return { isValid: true };
}

/**
 * Validates a create cancellation request
 * @param data - The cancellation data to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateCreateCancellation(
  data: unknown
): { isValid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid request body" };
  }

  const cancellationData = data as Partial<CreateCancellationRequest>;

  // ticketId is required
  if (!cancellationData.ticketId || typeof cancellationData.ticketId !== "string") {
    return {
      isValid: false,
      error: "ticketId is required and must be a string",
    };
  }

  // reason is required
  if (!cancellationData.reason || typeof cancellationData.reason !== "string") {
    return {
      isValid: false,
      error: "reason is required and must be a string",
    };
  }

  // Reason cannot be empty
  if (cancellationData.reason.trim().length === 0) {
    return {
      isValid: false,
      error: "reason cannot be empty",
    };
  }

  return { isValid: true };
}

/**
 * Validates a create refund request
 * @param data - The refund data to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateCreateRefund(
  data: unknown
): { isValid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid request body" };
  }

  const refundData = data as Partial<CreateRefundRequest>;

  // cancellationId is required
  if (
    !refundData.cancellationId ||
    typeof refundData.cancellationId !== "string"
  ) {
    return {
      isValid: false,
      error: "cancellationId is required and must be a string",
    };
  }

  return { isValid: true };
}
