import { Request, Response, NextFunction } from "express";

/**
 * Request logging middleware
 * Only logs errors or slow requests (>1s) in production to reduce log noise
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV === "production") {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      // Only log errors or slow requests in production
      if (res.statusCode >= 400 || duration > 1000) {
        console.log(
          `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`
        );
      }
    });
  }
  next();
};
