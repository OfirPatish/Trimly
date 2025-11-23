import prisma from "../../config/database.js";
import { SLOT_DURATION_MINUTES } from "./constants.js";
import {
  getSlotsForService,
  isValidSlotTime,
  getAppointmentDuration,
  getSameDayDateRange,
  doTimeRangesOverlap,
} from "./utils.js";

interface ConflictResult {
  hasConflict: boolean;
  conflictingAppointment?: any;
}

/**
 * Get appointments for same-day conflict checking
 * Extracted common query logic
 */
const getSameDayAppointments = async (
  appointmentDateStart: Date,
  appointmentDateEnd: Date,
  filter: { barberId?: string; userId?: string },
  excludeAppointmentId?: string
) => {
  return await prisma.appointment.findMany({
    where: {
      ...filter,
      status: {
        not: "cancelled",
      },
      appointmentDate: {
        gte: appointmentDateStart,
        lt: appointmentDateEnd,
      },
      ...(excludeAppointmentId && { id: { not: excludeAppointmentId } }),
    },
    include: {
      service: {
        select: {
          duration: true,
        },
      },
    },
  });
};

/**
 * Helper function to check if appointments overlap
 * Extracted common logic from conflict checking functions
 */
const checkAppointmentOverlaps = (
  appointmentStart: Date,
  appointmentEnd: Date,
  existingAppointments: any[]
): ConflictResult => {
  for (const existing of existingAppointments) {
    const existingStart = new Date(existing.appointmentDate);
    const existingDuration = getAppointmentDuration(
      existing,
      SLOT_DURATION_MINUTES
    );
    const existingEnd = new Date(existingStart);
    existingEnd.setMinutes(existingEnd.getMinutes() + existingDuration);

    if (
      doTimeRangesOverlap(
        appointmentStart,
        appointmentEnd,
        existingStart,
        existingEnd
      )
    ) {
      return {
        hasConflict: true,
        conflictingAppointment: existing,
      };
    }
  }

  return { hasConflict: false };
};

/**
 * Check for appointment conflicts with existing appointments
 * Simple slot-based checking: if any slot overlaps, there's a conflict
 * @param appointmentDate - The requested appointment date/time (must be a valid slot time)
 * @param barberId - The barber ID to check conflicts for
 * @param excludeAppointmentId - Optional appointment ID to exclude from conflict check (for updates)
 * @param serviceId - Optional service ID to determine how many slots are needed
 * @returns Object indicating if there's a conflict and the conflicting appointment if found
 */
export const checkAppointmentConflict = async (
  appointmentDate: Date,
  barberId: string,
  excludeAppointmentId?: string,
  serviceId?: string
): Promise<ConflictResult> => {
  // Validate that appointment starts at a valid slot time
  if (!isValidSlotTime(appointmentDate)) {
    return {
      hasConflict: true,
      conflictingAppointment: null,
    };
  }

  // Get service duration if serviceId is provided
  let appointmentDuration = SLOT_DURATION_MINUTES;
  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { serviceId },
      select: { duration: true, isActive: true },
    });
    if (service && service.isActive) {
      appointmentDuration = service.duration;
    }
  }

  // Calculate how many slots this appointment needs
  const slotsNeeded = getSlotsForService(appointmentDuration);
  const appointmentStart = new Date(appointmentDate);
  const appointmentEnd = new Date(appointmentStart);
  appointmentEnd.setMinutes(
    appointmentEnd.getMinutes() + slotsNeeded * SLOT_DURATION_MINUTES
  );

  // Calculate date range to only check appointments on the same day
  const { start: appointmentDateStart, end: appointmentDateEnd } =
    getSameDayDateRange(appointmentStart);

  // Get non-cancelled appointments for this specific barber on the same day
  const existingAppointments = await getSameDayAppointments(
    appointmentDateStart,
    appointmentDateEnd,
    { barberId },
    excludeAppointmentId
  );

  // Check for slot overlaps - simple time range overlap check
  return checkAppointmentOverlaps(
    appointmentStart,
    appointmentEnd,
    existingAppointments
  );
};

/**
 * Check if a customer already has an overlapping appointment
 * Prevents customers from booking multiple appointments at overlapping times
 * @param userId - The customer's user ID
 * @param appointmentDate - The requested appointment date/time
 * @param appointmentDuration - The duration of the appointment in minutes
 * @param excludeAppointmentId - Optional appointment ID to exclude from conflict check (for updates)
 * @returns Object indicating if there's a conflict
 */
export const checkCustomerAppointmentConflict = async (
  userId: string,
  appointmentDate: Date,
  appointmentDuration: number,
  excludeAppointmentId?: string
): Promise<ConflictResult> => {
  const appointmentStart = new Date(appointmentDate);
  const appointmentEnd = new Date(appointmentStart);
  appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointmentDuration);

  // Calculate date range to only check appointments on the same day
  const { start: appointmentDateStart, end: appointmentDateEnd } =
    getSameDayDateRange(appointmentStart);

  // Get non-cancelled appointments for this customer on the same day
  const existingAppointments = await getSameDayAppointments(
    appointmentDateStart,
    appointmentDateEnd,
    { userId },
    excludeAppointmentId
  );

  // Check for time overlaps
  return checkAppointmentOverlaps(
    appointmentStart,
    appointmentEnd,
    existingAppointments
  );
};
