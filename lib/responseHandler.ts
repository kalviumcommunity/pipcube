import { NextResponse } from "next/server";
import type { ErrorCode } from "@/lib/errorCodes";
import { ErrorCodes } from "@/lib/errorCodes";

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  error?: undefined;
  timestamp: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  data?: undefined;
  error: {
    code: ErrorCode;
    details?: unknown;
  };
  timestamp: string;
};

export type GlobalApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function sendSuccess<T>(
  data: T,
  message = "Success",
  status = 200
): NextResponse<GlobalApiResponse<T>> {
  const body: SuccessResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status });
}

export function sendError(
  message = "Something went wrong",
  code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
  status = 500,
  details?: unknown
): NextResponse<GlobalApiResponse<never>> {
  const body: ErrorResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details !== undefined ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status });
}

