import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { requireBarber } from "../middleware/barber.js";
import {
  getBarbers,
  getBarberAppointments,
  updateAppointmentStatus,
} from "../controllers/barbers/barberController.js";
import {
  getBarberScheduleController as getBarberSchedule,
  getBarberSchedulesController as getBarberSchedules,
  createBarberScheduleController as createBarberSchedule,
  updateBarberScheduleController as updateBarberSchedule,
  deleteBarberScheduleController as deleteBarberSchedule,
} from "../controllers/barbers/scheduleController.js";
import {
  validateCreateSchedule,
  validateUpdateSchedule,
} from "../utils/request-validators/schedules.js";
import { validateUpdateAppointmentStatus } from "../utils/request-validators/barbers.js";

const router = Router();

// Public endpoint - anyone can see available barbers
router.get("/", getBarbers);

// Protected barber endpoints
router.get("/appointments", authenticate, requireBarber, getBarberAppointments);

router.put(
  "/appointments/:id/status",
  authenticate,
  requireBarber,
  validateUpdateAppointmentStatus,
  updateAppointmentStatus
);

// Schedule management endpoints (barber-only)
// GET /schedules?date=YYYY-MM-DD - get single schedule for a date
// GET /schedules?startDate=...&endDate=... - get schedules in range
// GET /schedules - get all schedules
router.get(
  "/schedules",
  authenticate,
  requireBarber,
  async (req, res, next) => {
    // If date query param exists, use getBarberSchedule, otherwise use getBarberSchedules
    if (req.query.date) {
      await getBarberSchedule(req, res, next);
    } else {
      await getBarberSchedules(req, res, next);
    }
  }
);
router.post(
  "/schedules",
  authenticate,
  requireBarber,
  validateCreateSchedule,
  createBarberSchedule
);
router.put(
  "/schedules/:id",
  authenticate,
  requireBarber,
  validateUpdateSchedule,
  updateBarberSchedule
);
router.delete(
  "/schedules/:id",
  authenticate,
  requireBarber,
  deleteBarberSchedule
);

export default router;
