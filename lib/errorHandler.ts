
import { NextResponse } from "next/server";
import { logger } from "./logger";

interface ErrorResponse {
    error: string;
    code?: string;
    details?: any;
    stack?: string;
}

export function handleError(error: any, context: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const timestamp = new Date().toISOString();

    // Extract error details
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    const code = error.code || 'INTERNAL_ERROR';

    // Log the error
    // in production, we might want to redact the stack from the logs if it contains sensitive info, 
    // but typically logs *should* have stacks for debugging. 
    // The user requirement said: "redacting stack traces in production" for the logs.
    logger.error(`Error in ${context}`, {
        error: message,
        code,
        stack: isProduction ? undefined : stack, // Redact stack in prod logs per requirement
        context,
        timestamp,
    });

    // Construct response
    const responsePayload: ErrorResponse = {
        error: isProduction ? "Internal Server Error" : message,
    };

    if (!isProduction) {
        responsePayload.stack = stack;
        responsePayload.code = code;
    }

    // Use appropriate status code
    // We default to 500, but could check for specific error types if needed (e.g., ZodError -> 400)
    const status = 500;

    return NextResponse.json(responsePayload, { status });
}
