/**
 * Zod schema for ticket validation
 * Validates ticket creation requests (bookings)
 */

import { z } from "zod";

/**
 * Schema for creating a new ticket (booking)
 * - userId: Required string (user ID)
 * - tripId: Required string (trip ID)
 * - seatNumber: Required string, non-empty
 */
export const createTicketSchema = z.object({
  userId: z
    .string({
      required_error: "userId is required",
      invalid_type_error: "userId must be a string",
    })
    .min(1, "userId cannot be empty"),
  tripId: z
    .string({
      required_error: "tripId is required",
      invalid_type_error: "tripId must be a string",
    })
    .min(1, "tripId cannot be empty"),
  seatNumber: z
    .string({
      required_error: "seatNumber is required",
      invalid_type_error: "seatNumber must be a string",
    })
    .min(1, "seatNumber cannot be empty")
    .trim(),
});

/**
 * TypeScript type inferred from the schema
 * Use this type instead of manually defining CreateTicketRequest
 */
export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
