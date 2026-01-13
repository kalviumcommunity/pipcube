/**
 * Helper function to format Zod validation errors into a structured format
 * Returns an array of { field, message } objects for easy consumption
 */

import { ZodError } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Formats Zod errors into a structured array of field-level errors
 * @param error - The ZodError instance
 * @returns Array of validation errors with field and message
 */
export function formatZodError(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join(".") || "unknown",
    message: err.message,
  }));
}
