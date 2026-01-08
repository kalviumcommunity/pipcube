/**
 * Zod schema for cancellation validation
 * Validates cancellation creation requests
 */

import { z } from "zod";

/**
 * Schema for creating a new cancellation request
 * - ticketId: Required string (ticket ID)
 * - reason: Required string with minimum length
 */
export const createCancellationSchema = z.object({
  ticketId: z
    .string({
      required_error: "ticketId is required",
      invalid_type_error: "ticketId must be a string",
    })
    .min(1, "ticketId cannot be empty"),
  reason: z
    .string({
      required_error: "reason is required",
      invalid_type_error: "reason must be a string",
    })
    .min(3, "Reason must be at least 3 characters long")
    .trim(),
});

/**
 * TypeScript type inferred from the schema
 */
export type CreateCancellationSchema = z.infer<typeof createCancellationSchema>;
