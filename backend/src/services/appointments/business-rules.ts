import prisma from "../../config/database.js";
import {
  SAME_DAY_ADVANCE_BOOKING_MINUTES,
  MAX_ADVANCE_BOOKING_MONTHS,
  CANCELLATION_DEADLINE_HOURS,
  MAX_APPOINTMENTS_PER_DAY,
} from "./constants.js";
import { isValidSlotTime } from "./utils.js";
import {
  startOfDay,
  isSameDay,
  addMinutes,
  addMonths,
  subHours,
  isBefore,
  isAfter,
} from "date-fns";

/**
 * Business Rules Validation - Service Layer
 * Validates business logic rules for appointments (not HTTP request format)
 */

/**
 * Validate that an appointment date meets the minimum and maximum advance booking requirements
 * For same-day bookings: must be at least 15 minutes in advance
 * For future-day bookings: cannot book more than 3 months in advance
 * Also validates that the appointment starts at a valid slot time (:00, :20, :40)
 * @param appointmentDate - The requested appointment date
 * @returns Object with isValid flag and optional error message
 */
export const validateAdvanceBooking = (
  appointmentDate: Date
): { isValid: boolean; error?: string } => {
  const now = new Date();

  // Validate slot time
  if (!isValidSlotTime(appointmentDate)) {
    return {
      isValid: false,
      error: "Appointments must start at :00, :20, or :40 past the hour",
    };
  }

  // Check if this is a same-day booking
  const today = startOfDay(now);
  const isSameDayBooking = isSameDay(appointmentDate, today);

  if (isSameDayBooking) {
    // For same-day bookings, require at least 15 minutes advance
    const minBookingTime = addMinutes(now, SAME_DAY_ADVANCE_BOOKING_MINUTES);

    if (isBefore(appointmentDate, minBookingTime)) {
      return {
        isValid: false,
        error: `Same-day appointments must be booked at least ${SAME_DAY_ADVANCE_BOOKING_MINUTES} minutes in advance`,
      };
    }
  }

  // Check that the appointment is not in the past
  if (isBefore(appointmentDate, now)) {
    return {
      isValid: false,
      error: "Cannot book appointments in the past",
    };
  }

  // Check maximum advance booking (3 months)
  const maxBookingDate = addMonths(now, MAX_ADVANCE_BOOKING_MONTHS);

  if (isAfter(appointmentDate, maxBookingDate)) {
    return {
      isValid: false,
      error: `Cannot book appointments more than ${MAX_ADVANCE_BOOKING_MONTHS} months in advance`,
    };
  }

  return { isValid: true };
};

/**
 * Check if user can cancel an appointment (must be at least 1 hour before)
 * @param appointmentDate - The appointment date/time
 * @returns Object with canCancel flag and optional error message
 */
export const canCancelAppointment = (
  appointmentDate: Date
): { canCancel: boolean; error?: string } => {
  const now = new Date();
  const cancellationDeadline = subHours(
    appointmentDate,
    CANCELLATION_DEADLINE_HOURS
  );

  if (isAfter(now, cancellationDeadline)) {
    return {
      canCancel: false,
      error: `Appointments must be cancelled at least ${CANCELLATION_DEADLINE_HOURS} hours in advance`,
    };
  }

  return { canCancel: true };
};

/**
 * Check if user has reached the maximum appointments per day
 * @param userId - The user ID
 * @param appointmentDate - The requested appointment date
 * @param excludeAppointmentId - Optional appointment ID to exclude from count (for updates)
 * @returns Object with isValid flag and optional error message
 */
export const checkMaxAppointmentsPerDay = async (
  userId: string,
  appointmentDate: Date,
  excludeAppointmentId?: string
): Promise<{ isValid: boolean; error?: string }> => {
  // Use raw SQL to compare dates by day, ignoring time and timezone
  // This ensures we're comparing the actual calendar day correctly
  const year = appointmentDate.getUTCFullYear();
  const month = appointmentDate.getUTCMonth() + 1; // getUTCMonth() returns 0-11
  const day = appointmentDate.getUTCDate();

  // Format date as YYYY-MM-DD for comparison
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  // Use Prisma raw query to count appointments on the same calendar day
  // This compares dates correctly regardless of timezone
  // Convert appointment_date to UTC timezone, then extract just the date part for comparison
  let result: Array<{ count: bigint }>;

  if (excludeAppointmentId) {
    result = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::int as count
      FROM appointments
      WHERE user_id = ${userId}
        AND status != 'cancelled'
        AND DATE(appointment_date AT TIME ZONE 'UTC') = ${dateString}::date
        AND id != ${excludeAppointmentId}
    `;
  } else {
    result = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::int as count
      FROM appointments
      WHERE user_id = ${userId}
        AND status != 'cancelled'
        AND DATE(appointment_date AT TIME ZONE 'UTC') = ${dateString}::date
    `;
  }

  const existingAppointments = Number(result[0]?.count || 0);

  if (existingAppointments >= MAX_APPOINTMENTS_PER_DAY) {
    return {
      isValid: false,
      error: `You can only have ${MAX_APPOINTMENTS_PER_DAY} appointment${
        MAX_APPOINTMENTS_PER_DAY > 1 ? "s" : ""
      } per day`,
    };
  }

  return { isValid: true };
};

/**
 * Find an appointment and verify the user owns it
 * @param appointmentId - The appointment ID
 * @param userId - The user ID to verify ownership
 * @returns The appointment if found and owned by user, null otherwise
 */
export const findAndVerifyAppointmentOwnership = async (
  appointmentId: string,
  userId: string
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    return { appointment: null, error: "Appointment not found" };
  }

  if (appointment.userId !== userId) {
    return { appointment: null, error: "Access denied" };
  }

  return { appointment, error: null };
};
