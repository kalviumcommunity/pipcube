// Validation utilities for API requests

import type { CreateUserRequest, CreateBookingRequest } from "@/types/api";

/**
 * Validates a create user request
 * @param data - The user data to validate
 * @returns Validation error message or null if valid
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
 * Validates a create booking request
 * @param data - The booking data to validate
 * @returns Validation error message or null if valid
 */
export function validateCreateBooking(
  data: unknown
): { isValid: boolean; error?: string } {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Invalid request body" };
  }

  const bookingData = data as Partial<CreateBookingRequest>;

  // userId is required
  if (!bookingData.userId || typeof bookingData.userId !== "string") {
    return {
      isValid: false,
      error: "userId is required and must be a string",
    };
  }

  // route is required
  if (!bookingData.route || typeof bookingData.route !== "string") {
    return {
      isValid: false,
      error: "route is required and must be a string",
    };
  }

  // departureDate is required
  if (
    !bookingData.departureDate ||
    typeof bookingData.departureDate !== "string"
  ) {
    return {
      isValid: false,
      error: "departureDate is required and must be a string",
    };
  }

  // departureTime is required
  if (
    !bookingData.departureTime ||
    typeof bookingData.departureTime !== "string"
  ) {
    return {
      isValid: false,
      error: "departureTime is required and must be a string",
    };
  }

  // seatNumber is required
  if (!bookingData.seatNumber || typeof bookingData.seatNumber !== "string") {
    return {
      isValid: false,
      error: "seatNumber is required and must be a string",
    };
  }

  // price is required and must be a number
  if (
    bookingData.price === undefined ||
    typeof bookingData.price !== "number" ||
    bookingData.price < 0
  ) {
    return {
      isValid: false,
      error: "price is required and must be a positive number",
    };
  }

  return { isValid: true };
}
