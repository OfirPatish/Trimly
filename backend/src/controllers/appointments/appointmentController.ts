import { Request, Response, NextFunction } from "express";
import {
  getAvailableTimeSlots,
  getUserAppointments,
  createAppointmentService,
  deleteAppointmentService,
} from "../../services/appointments/index.js";
import { CreateAppointmentRequest } from "../../types/requests.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../middleware/errorHandler.js";

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointments = await getUserAppointments(req.user!.id);
    res.json({ appointments });
  } catch (error) {
    next(error);
  }
};

// Get availability for a specific date and barber (returns only available time slots)
export const getAvailability = async (
  req: Request<
    {},
    {},
    {},
    { date?: string; barberId?: string; serviceId?: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, barberId, serviceId } = req.query;
    if (!date) {
      throw new ValidationError("Date parameter is required");
    }
    if (!barberId) {
      throw new ValidationError("Barber ID parameter is required");
    }

    const availableSlots = await getAvailableTimeSlots(
      date,
      barberId,
      serviceId as string | undefined
    );

    res.json({
      availableSlots,
      date, // Return the same date string
      barberId,
    });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (
  req: Request<{}, {}, CreateAppointmentRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only customers can create appointments
    if (req.user!.role !== "customer") {
      throw new ForbiddenError("Only customers can create appointments");
    }

    const appointment = await createAppointmentService(req.user!.id, req.body);

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error: any) {
    if (
      error.message.includes("time slot") ||
      error.message.includes("already booked")
    ) {
      next(new ConflictError(error.message));
      return;
    }
    if (
      error.message.includes("Invalid service") ||
      error.message.includes("Service is not available") ||
      error.message.includes("Price") ||
      error.message.includes("Barber selection") ||
      error.message.includes("advance") ||
      error.message.includes("appointments per day")
    ) {
      next(new ValidationError(error.message));
      return;
    }
    next(error);
  }
};

export const deleteAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await deleteAppointmentService(id, req.user!.id);

    res.json({ message: "Appointment deleted successfully" });
  } catch (error: any) {
    if (error.message === "Appointment not found") {
      next(new NotFoundError(error.message));
      return;
    }
    if (
      error.message.includes("Access denied") ||
      error.message.includes("own")
    ) {
      next(new ForbiddenError(error.message));
      return;
    }
    if (error.message.includes("cancel") || error.message.includes("hour")) {
      next(new ValidationError(error.message));
      return;
    }
    next(error);
  }
};
