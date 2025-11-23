import { CorsOptions } from "cors";

/**
 * Get CORS origins based on environment
 */
const getCorsOrigins = (): string[] => {
  if (process.env.NODE_ENV === "production") {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error(
        "ERROR: FRONTEND_URL is required in production. CORS will be restricted."
      );
      // In production, fail fast if FRONTEND_URL is missing
      // Return empty array to block all origins (safer than allowing all)
      return [];
    }
    return frontendUrl.split(",").map((url) => url.trim());
  }
  return ["http://localhost:3001", "http://localhost:3000"]; // Allow both ports in dev
};

/**
 * CORS configuration options
 */
export const corsOptions: CorsOptions = {
  origin: getCorsOrigins(),
  credentials: true, // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
