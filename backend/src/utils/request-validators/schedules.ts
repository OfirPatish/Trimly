import { body, ValidationChain } from "express-validator";
import { RequestHandler } from "express";
import { handleValidationErrors } from "./validation-handler.js";

// Schedule validation - Request validation (HTTP layer)
export const validateCreateSchedule: (ValidationChain | RequestHandler)[] = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format")
    .custom((value) => {
      // Validate YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        throw new Error("Date must be in YYYY-MM-DD format");
      }
      return true;
    }),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format (24-hour)"),
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format (24-hour)")
    .custom((value, { req }) => {
      const startTime = req.body.startTime;
      if (startTime && value) {
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = value.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        if (endMinutes <= startMinutes) {
          throw new Error("End time must be after start time");
        }
      }
      return true;
    }),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  handleValidationErrors,
];

// Update schedule validation - Request validation (HTTP layer)
export const validateUpdateSchedule: (ValidationChain | RequestHandler)[] = [
  body("startTime")
    .optional()
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format (24-hour)"),
  body("endTime")
    .optional()
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format (24-hour)")
    .custom((value, { req }) => {
      const startTime = req.body.startTime;
      // Only validate if both times are provided
      if (startTime && value) {
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = value.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        if (endMinutes <= startMinutes) {
          throw new Error("End time must be after start time");
        }
      }
      return true;
    }),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  handleValidationErrors,
];
