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
    .string()
    .min(2, "Name must be at least 2 characters long")
    .trim(),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

/**
 * TypeScript type inferred from the schema
 * Use this type instead of manually defining CreateUserRequest
 */
export type CreateUserSchema = z.infer<typeof createUserSchema>;
