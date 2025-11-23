import { body, ValidationChain } from "express-validator";
import { RequestHandler } from "express";
import { handleValidationErrors } from "./validation-handler.js";

// Registration validation - Request validation (HTTP layer)
export const validateRegister: (ValidationChain | RequestHandler)[] = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters long"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  handleValidationErrors,
];

// Login validation - Request validation (HTTP layer)
export const validateLogin: (ValidationChain | RequestHandler)[] = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];
