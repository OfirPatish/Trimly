import { body, ValidationChain } from "express-validator";
import { RequestHandler } from "express";
import { handleValidationErrors } from "./validation-handler.js";

// Create service validation - Request validation (HTTP layer)
export const validateCreateService: (ValidationChain | RequestHandler)[] = [
  body("serviceId")
    .trim()
    .notEmpty()
    .withMessage("Service ID is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Service ID must be lowercase letters, numbers, and hyphens only"
    ),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Service name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Service name must be between 1 and 100 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("duration")
    .isInt({ min: 20 })
    .withMessage("Duration must be at least 20 minutes")
    .custom((value) => value % 20 === 0)
    .withMessage("Duration must be a multiple of 20 minutes"),
  handleValidationErrors,
];

// Update service validation - Request validation (HTTP layer)
export const validateUpdateService: (ValidationChain | RequestHandler)[] = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Service name cannot be empty if provided")
    .isLength({ min: 1, max: 100 })
    .withMessage("Service name must be between 1 and 100 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("duration")
    .optional()
    .isInt({ min: 20 })
    .withMessage("Duration must be at least 20 minutes")
    .custom((value) => value % 20 === 0)
    .withMessage("Duration must be a multiple of 20 minutes"),
  handleValidationErrors,
];
