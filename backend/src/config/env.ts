import dotenv from "dotenv";

dotenv.config();

/**
 * Validate required environment variables
 */
export const validateEnv = (): void => {
  const required = ["JWT_SECRET", "DATABASE_URL"];

  for (const key of required) {
    if (!process.env[key]) {
      console.error(`ERROR: ${key} environment variable is required`);
      process.exit(1);
    }
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "WARNING: JWT_SECRET should be at least 32 characters long for security"
    );
  }
};
