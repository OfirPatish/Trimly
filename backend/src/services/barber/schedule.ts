import prisma from "../../config/database.js";
import { format } from "date-fns";
import {
  validatePastTimeOnSameDate,
  validateTimeRange,
} from "../appointments/utils.js";

/**
 * Validate date string format (YYYY-MM-DD)
 */
export const validateDateString = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString + "T00:00:00.000Z");
  return date.toISOString().startsWith(dateString);
};

/**
 * Validate time string format (HH:MM)
 */
export const validateTimeString = (timeString: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return false;
  }
  return true;
};

/**
 * Convert date string (YYYY-MM-DD) to DateTime (date only, time set to midnight UTC)
 */
const dateStringToDateTime = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00.000Z");
};

/**
 * Get schedule for a barber on a specific date
 */
export const getBarberSchedule = async (
  barberId: string,
  dateString: string
) => {
  // Validate date format
  if (!validateDateString(dateString)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  const date = dateStringToDateTime(dateString);

  const schedule = await prisma.barberSchedule.findUnique({
    where: {
      barberId_date: {
        barberId,
        date,
      },
    },
  });

  return {
    schedule: schedule
      ? {
          ...schedule,
          date: format(schedule.date, "yyyy-MM-dd"),
        }
      : null,
  };
};

/**
 * Get schedules for a barber within a date range
 */
export const getBarberSchedules = async (
  barberId: string,
  params?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  const where: any = {
    barberId,
  };

  if (params?.startDate || params?.endDate) {
    where.date = {};
    if (params.startDate) {
      if (!validateDateString(params.startDate)) {
        throw new Error("Invalid startDate format. Expected YYYY-MM-DD");
      }
      where.date.gte = dateStringToDateTime(params.startDate);
    }
    if (params.endDate) {
      if (!validateDateString(params.endDate)) {
        throw new Error("Invalid endDate format. Expected YYYY-MM-DD");
      }
      const endDate = dateStringToDateTime(params.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      where.date.lte = endDate;
    }
  }

  const schedules = await prisma.barberSchedule.findMany({
    where,
    orderBy: {
      date: "asc",
    },
  });

  return {
    schedules: schedules.map((schedule) => ({
      ...schedule,
      date: format(schedule.date, "yyyy-MM-dd"),
    })),
  };
};

/**
 * Create schedule for a barber on a specific date
 */
export const createBarberSchedule = async (
  barberId: string,
  data: {
    date: string;
    startTime: string;
    endTime: string;
    isActive?: boolean;
  }
) => {
  // Validate date format
  if (!validateDateString(data.date)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  // Validate time formats
  if (!validateTimeString(data.startTime)) {
    throw new Error("Invalid startTime format. Expected HH:MM");
  }
  if (!validateTimeString(data.endTime)) {
    throw new Error("Invalid endTime format. Expected HH:MM");
  }

  // Validate that end time is after start time
  const timeRangeValidation = validateTimeRange(data.startTime, data.endTime);
  if (!timeRangeValidation.isValid) {
    throw new Error(timeRangeValidation.error);
  }

  const date = dateStringToDateTime(data.date);

  // Validate that barber can't set past time on the same date
  const pastTimeValidation = validatePastTimeOnSameDate(data.startTime, date);
  if (!pastTimeValidation.isValid) {
    throw new Error(pastTimeValidation.error);
  }

  const schedule = await prisma.barberSchedule.create({
    data: {
      barberId,
      date,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive ?? true,
    },
  });

  return {
    schedule: {
      ...schedule,
      date: format(schedule.date, "yyyy-MM-dd"),
    },
  };
};

/**
 * Update schedule for a barber
 */
export const updateBarberSchedule = async (
  scheduleId: string,
  barberId: string,
  data: {
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
  }
) => {
  // Get existing schedule to validate
  const existingSchedule = await prisma.barberSchedule.findUnique({
    where: { id: scheduleId },
  });

  if (!existingSchedule) {
    throw new Error("Schedule not found");
  }

  if (existingSchedule.barberId !== barberId) {
    throw new Error("Access denied");
  }

  // Validate time formats if provided
  const startTime = data.startTime || existingSchedule.startTime;
  const endTime = data.endTime || existingSchedule.endTime;

  if (data.startTime && !validateTimeString(data.startTime)) {
    throw new Error("Invalid startTime format. Expected HH:MM");
  }
  if (data.endTime && !validateTimeString(data.endTime)) {
    throw new Error("Invalid endTime format. Expected HH:MM");
  }

  // Validate that end time is after start time
  const timeRangeValidation = validateTimeRange(startTime, endTime);
  if (!timeRangeValidation.isValid) {
    throw new Error(timeRangeValidation.error);
  }

  // Validate that barber can't set past time on the same date
  // Only validate if startTime is being updated
  if (data.startTime) {
    const pastTimeValidation = validatePastTimeOnSameDate(
      data.startTime,
      existingSchedule.date
    );
    if (!pastTimeValidation.isValid) {
      throw new Error(pastTimeValidation.error);
    }
  }

  const schedule = await prisma.barberSchedule.update({
    where: { id: scheduleId },
    data: {
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime && { endTime: data.endTime }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return {
    schedule: {
      ...schedule,
      date: format(schedule.date, "yyyy-MM-dd"),
    },
  };
};

/**
 * Delete schedule for a barber
 */
export const deleteBarberSchedule = async (
  scheduleId: string,
  barberId: string
) => {
  // Verify schedule exists and belongs to barber
  const schedule = await prisma.barberSchedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  if (schedule.barberId !== barberId) {
    throw new Error("Access denied");
  }

  await prisma.barberSchedule.delete({
    where: { id: scheduleId },
  });
};
