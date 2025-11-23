import { Request, Response, NextFunction } from "express";
import {
  getBarberSchedule,
  getBarberSchedules,
  createBarberSchedule,
  updateBarberSchedule,
  deleteBarberSchedule,
} from "../../services/barber/index.js";
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "../../types/requests.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../../middleware/errorHandler.js";

// Get schedule for a specific date (barber-only)
// Note: requireBarber middleware ensures req.user exists and is a barber
export const getBarberScheduleController = async (
  req: Request<{}, {}, {}, { date?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date } = req.query;
    if (!date) {
      throw new ValidationError("Date parameter is required");
    }

    const result = await getBarberSchedule(req.user!.id, date);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get schedules for a date range (barber-only)
// Note: requireBarber middleware ensures req.user exists and is a barber
export const getBarberSchedulesController = async (
  req: Request<{}, {}, {}, { startDate?: string; endDate?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const result = await getBarberSchedules(req.user!.id, {
      startDate,
      endDate,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Create schedule for a specific date (barber-only)
// Note: requireBarber middleware ensures req.user exists and is a barber
// Note: Validation is handled by validateCreateSchedule middleware
export const createBarberScheduleController = async (
  req: Request<{}, {}, CreateScheduleRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, startTime, endTime, isActive } = req.body;

    const result = await createBarberSchedule(req.user!.id, {
      date,
      startTime,
      endTime,
      isActive,
    });

    res.status(201).json({
      message: "Schedule created successfully",
      schedule: result.schedule,
    });
  } catch (error: any) {
    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      next(
        new ValidationError(
          error.message || "Schedule already exists for this date"
        )
      );
      return;
    }
    next(error);
  }
};

// Update schedule (barber-only)
// Note: requireBarber middleware ensures req.user exists and is a barber
export const updateBarberScheduleController = async (
  req: Request<{ id: string }, {}, UpdateScheduleRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await updateBarberSchedule(id, req.user!.id, data);

    res.json({
      message: "Schedule updated successfully",
      schedule: result.schedule,
    });
  } catch (error: any) {
    if (error.message === "Schedule not found") {
      next(new NotFoundError(error.message));
      return;
    }
    if (error.message === "Access denied") {
      next(new ForbiddenError(error.message));
      return;
    }
    if (
      error.message.includes("Invalid") ||
      error.message.includes("must be after")
    ) {
      next(new ValidationError(error.message));
      return;
    }
    next(error);
  }
};

// Delete schedule (barber-only)
// Note: requireBarber middleware ensures req.user exists and is a barber
export const deleteBarberScheduleController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await deleteBarberSchedule(id, req.user!.id);
    res.json({ message: "Schedule deleted successfully" });
  } catch (error: any) {
    if (error.message === "Schedule not found") {
      next(new NotFoundError(error.message));
      return;
    }
    if (error.message === "Access denied") {
      next(new ForbiddenError(error.message));
      return;
    }
    next(error);
  }
};
