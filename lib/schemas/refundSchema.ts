/**
 * Zod schema for refund validation
 * Validates refund processing requests
 */

import { z } from "zod";

/**
 * Schema for creating a new refund request
 * - cancellationId: Required string (cancellation ID)
 */
export const createRefundSchema = z.object({
  cancellationId: z
    .string({
      required_error: "cancellationId is required",
      invalid_type_error: "cancellationId must be a string",
    })
    .min(1, "cancellationId cannot be empty"),
});

/**
 * TypeScript type inferred from the schema
 */
export type CreateRefundSchema = z.infer<typeof createRefundSchema>;
