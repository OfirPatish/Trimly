import { body, ValidationChain } from "express-validator";
import { RequestHandler } from "express";
import { handleValidationErrors } from "./validation-handler.js";

// Appointment validation - Request validation (HTTP layer)
export const validateAppointment: (ValidationChain | RequestHandler)[] = [
  body("appointmentDate")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      const appointmentDate = new Date(value);
      const now = new Date();
      if (appointmentDate <= now) {
        throw new Error("Appointment date must be in the future");
      }
      return true;
    }),
  body("barberId")
    .notEmpty()
    .withMessage("Barber selection is required")
    .isUUID()
    .withMessage("Invalid barber ID format"),
  body("serviceId")
    .optional()
    .isString()
    .withMessage("Invalid service ID format")
    .trim()
    .notEmpty()
    .withMessage("Service ID cannot be empty if provided"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
  handleValidationErrors,
];

// Update appointment validation - Request validation (HTTP layer)
export const validateAppointmentUpdate: (ValidationChain | RequestHandler)[] = [
  body("appointmentDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date")
    .custom((value) => {
      if (value) {
        const appointmentDate = new Date(value);
        const now = new Date();
        if (appointmentDate <= now) {
          throw new Error("Appointment date must be in the future");
        }
      }
      return true;
    }),
  body("status")
    .optional()
    .isIn(["completed", "cancelled"])
    .withMessage("Invalid status value"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
  handleValidationErrors,
];
