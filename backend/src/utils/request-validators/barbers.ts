import { body, ValidationChain } from "express-validator";
import { RequestHandler } from "express";
import { handleValidationErrors } from "./validation-handler.js";

// Update appointment status validation - Request validation (HTTP layer)
export const validateUpdateAppointmentStatus: (
  | ValidationChain
  | RequestHandler
)[] = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["completed", "cancelled"])
    .withMessage("Status must be either 'completed' or 'cancelled'"),
  handleValidationErrors,
];
