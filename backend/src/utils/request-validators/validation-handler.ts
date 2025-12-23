import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware to handle validation errors from express-validator
 * Used for request validation (HTTP layer)
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first error message for consistency with error handler
    const firstError = errors.array()[0];
    res.status(400).json({
      error: firstError.msg || "Validation failed",
      errors: errors.array(), // Keep array for potential future use
    });
    return;
  }
  next();
};
