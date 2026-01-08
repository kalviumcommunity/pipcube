/**
 * Zod schema for user validation
 * Validates user creation and update requests
 */

import { z } from "zod";

/**
 * Schema for creating a new user
 * - name: Required string with minimum 2 characters
 * - email: Optional valid email format
 * - phone: Optional string
 */
export const createUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters long")
    .trim(),
  email: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .optional()
    .or(z.literal("")), // Allow empty string or valid email
  phone: z
    .string({
      invalid_type_error: "Phone must be a string",
    })
    .optional()
    .or(z.literal("")), // Allow empty string or valid phone
});

/**
 * TypeScript type inferred from the schema
 * Use this type instead of manually defining CreateUserRequest
 */
export type CreateUserSchema = z.infer<typeof createUserSchema>;
