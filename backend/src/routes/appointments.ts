import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  deleteAppointment,
  getAvailability,
} from "../controllers/appointments/appointmentController.js";
import { validateAppointment } from "../utils/request-validators/appointments.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getAppointments);
router.get("/availability", getAvailability);
router.post("/", validateAppointment, createAppointment);
router.delete("/:id", deleteAppointment);

export default router;
