import { Request, Response, NextFunction } from "express";

/**
 * Custom error classes for different HTTP status codes
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Global error handler middleware
 * Handles both custom AppError instances and generic Error instances
 * Logs errors appropriately based on environment
 * Prevents exposing sensitive error details in production
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle custom AppError instances
  if (err instanceof AppError) {
    // Log error details
    if (process.env.NODE_ENV === "production") {
      console.error(`Error on ${req.method} ${req.path}:`, {
        message: err.message,
        statusCode: err.statusCode,
        ip: req.ip,
      });
    } else {
      console.error("AppError:", err);
    }

    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Handle unexpected errors
  if (process.env.NODE_ENV === "production") {
    console.error(`Unexpected error on ${req.method} ${req.path}:`, {
      message: err.message,
      stack: err.stack,
      ip: req.ip,
    });
  } else {
    console.error("Unexpected error:", err);
  }

  // Don't expose error details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(500).json({ error: message });
};
