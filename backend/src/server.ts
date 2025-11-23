import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import barberRoutes from "./routes/barbers.js";
import serviceRoutes from "./routes/services.js";
import { validateEnv, corsOptions, prisma } from "./config/index.js";
import {
  securityMiddleware,
  limiter,
  authLimiter,
  requestLogger,
  errorHandler,
} from "./middleware/index.js";

// Validate required environment variables
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - required when behind a reverse proxy (e.g., Render.com, Heroku)
// This allows express-rate-limit to correctly identify client IPs from X-Forwarded-For headers
// Use 1 to trust only the first proxy (safer than trusting all proxies)
// Set to false in development if not behind a proxy
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);

// Security middleware - must be before other middleware
app.use(securityMiddleware);

// Compression middleware - reduce response size
app.use(compression());

// CORS middleware
app.use(cors(corsOptions));

// Rate limiting - protect against abuse
app.use(limiter);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route - includes database connectivity check
app.get("/health", async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      message: "Server is running",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Server is running but database is unavailable",
      database: "disconnected",
    });
  }
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes); // Stricter rate limiting for auth
app.use("/api/barbers", barberRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler - must be last
app.use(errorHandler);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`✓ Backend server started on port ${PORT}`);
  } else {
    console.log(`✓ Backend ready on http://localhost:${PORT}`);
  }
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log("HTTP server closed.");

    try {
      await prisma.$disconnect();
      console.log("Database connection closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
