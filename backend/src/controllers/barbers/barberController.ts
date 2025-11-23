import { Request, Response, NextFunction } from "express";
import {
  getAllBarbers,
  getBarberAppointmentsService,
  updateAppointmentStatusService,
} from "../../services/barber/index.js";
import { UpdateAppointmentStatusRequest } from "../../types/requests.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../../middleware/errorHandler.js";

// Get all barbers (public endpoint)
export const getBarbers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const barbers = await getAllBarbers();
    res.json({ barbers });
  } catch (error) {
    next(error);
  }
};

// Get appointments for a specific barber (barber-only endpoint)
// Note: requireBarber middleware ensures req.user exists and is a barber
export const getBarberAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, date } = req.query;

    const appointments = await getBarberAppointmentsService(req.user!.id, {
      status: status as string | undefined,
      date: date as string | undefined,
    });

    // Add barber info to each appointment
    const appointmentsWithBarber = appointments.map((appointment) => ({
      ...appointment,
      barber: {
        id: req.user!.id,
        name: req.user!.name,
      },
    }));

    res.json({ appointments: appointmentsWithBarber });
  } catch (error) {
    next(error);
  }
};

// Update appointment status (barber can mark appointments as completed or cancelled)
// Note: requireBarber middleware ensures req.user exists and is a barber
export const updateAppointmentStatus = async (
  req: Request<{ id: string }, {}, UpdateAppointmentStatusRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await updateAppointmentStatusService(
      id,
      req.user!.id,
      status
    );

    res.json({
      appointment: {
        ...updatedAppointment,
        barber: {
          id: req.user!.id,
          name: req.user!.name,
        },
      },
    });
  } catch (error: any) {
    if (error.message === "Invalid status") {
      next(new ValidationError(error.message));
      return;
    }
    if (error.message === "Appointment not found") {
      next(new NotFoundError(error.message));
      return;
    }
    if (error.message.includes("own appointments")) {
      next(new ForbiddenError(error.message));
      return;
    }
    next(error);
  }
};
