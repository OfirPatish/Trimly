/**
 * Centralized request validators exports
 * Import all validators from this file for cleaner imports
 */

// Export validation handler
export { handleValidationErrors } from "./validation-handler.js";

// Export all validators
export * from "./auth.js";
export * from "./appointments.js";
export * from "./schedules.js";
export * from "./services.js";
export * from "./barbers.js";
