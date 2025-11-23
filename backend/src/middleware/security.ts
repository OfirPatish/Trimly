import helmet from "helmet";

/**
 * Security middleware configuration
 * Sets various HTTP headers to help protect the app from well-known web vulnerabilities
 */
export const securityMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow CORS for API
});

