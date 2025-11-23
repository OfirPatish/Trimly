import { Router } from "express";
import {
  getServices,
  getAllServices,
} from "../controllers/services/serviceController.js";
import {
  createService,
  updateService,
  deleteService,
  restoreService,
} from "../controllers/services/serviceManagementController.js";
import { authenticate } from "../middleware/auth.js";
import { requireBarber } from "../middleware/barber.js";
import {
  validateCreateService,
  validateUpdateService,
} from "../utils/request-validators/services.js";

const router = Router();

// Public endpoint - anyone can see available services
router.get("/", getServices);

// Protected endpoint - only barbers can see all services (active + inactive)
router.get("/all", authenticate, requireBarber, getAllServices);

// Protected endpoint - only barbers can create services
router.post(
  "/",
  authenticate,
  requireBarber,
  validateCreateService,
  createService
);

// Protected endpoint - only barbers can update services
router.put(
  "/:serviceId",
  authenticate,
  requireBarber,
  validateUpdateService,
  updateService
);

// Protected endpoint - only barbers can delete services
router.delete("/:serviceId", authenticate, requireBarber, deleteService);

// Protected endpoint - only barbers can restore inactive services
router.post("/:serviceId/restore", authenticate, requireBarber, restoreService);

export default router;
