import { NextResponse } from "next/server";

export interface ApiResponseOptions {
  status?: number;
  headers?: Record<string, string>;
  meta?: Record<string, any>;
}

export function apiSuccess<T = any>(
  data: T,
  options: ApiResponseOptions = {}
): NextResponse {
  const status = options.status || 200;
  const body: Record<string, any> = {
    success: true,
    data,
  };

  if (options.meta) {
    body.meta = options.meta;
  }

  return NextResponse.json(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export function apiError(
  error: string,
  status = 400,
  details?: any,
  options: ApiResponseOptions = {}
): NextResponse {
  const body: Record<string, any> = {
    success: false,
    error,
  };

  if (details !== undefined) {
    body.details = details;
  }

  return NextResponse.json(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

