import { SLOT_DURATION_MINUTES } from "./constants.js";
import { startOfDay, isSameDay, addDays } from "date-fns";

/**
 * Parse a time slot string (HH:MM) to get hours and minutes
 * @param timeString - Time string in HH:MM format
 * @returns Object with hours and minutes as numbers
 */
export const parseTimeSlot = (
  timeString: string
): {
  hours: number;
  minutes: number;
} => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};

/**
 * Convert time string (HH:MM) to minutes since midnight
 * @param timeString - Time string in HH:MM format (e.g., "14:30")
 * @returns Minutes since midnight (e.g., 870 for "14:30")
 */
export const timeStringToMinutes = (timeString: string): number => {
  const { hours, minutes } = parseTimeSlot(timeString);
  return hours * 60 + minutes;
};

/**
 * Get current time in minutes since midnight
 * Internal utility used by validatePastTimeOnSameDate
 * @returns Current time in minutes since midnight
 */
const getCurrentTimeMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Get the number of slots a service requires
 * Services must use whole slots (multiples of 20 minutes)
 */
export const getSlotsForService = (durationMinutes: number): number => {
  return Math.ceil(durationMinutes / SLOT_DURATION_MINUTES);
};

/**
 * Check if a time slot is valid (starts at :00, :20, or :40)
 */
export const isValidSlotTime = (date: Date): boolean => {
  const minutes = date.getMinutes();
  return minutes === 0 || minutes === 20 || minutes === 40;
};

/**
 * Get appointment duration with fallback logic
 * Uses stored duration if available, otherwise falls back to service duration or default
 * @param appointment - Appointment object with optional duration and service
 * @param defaultDuration - Default duration to use if no other duration is available
 * @returns Duration in minutes
 */
export const getAppointmentDuration = (
  appointment: {
    duration?: number | null;
    service?: { duration?: number | null } | null;
  },
  defaultDuration: number = SLOT_DURATION_MINUTES
): number => {
  return (
    appointment.duration || appointment.service?.duration || defaultDuration
  );
};

/**
 * Get date range for same-day queries (start of day to start of next day)
 * @param date - The date to get range for
 * @returns Object with start and end dates for querying same-day appointments
 */
export const getSameDayDateRange = (
  date: Date
): {
  start: Date;
  end: Date;
} => {
  const dateStart = startOfDay(date);
  const dateEnd = addDays(dateStart, 1);
  return { start: dateStart, end: dateEnd };
};

/**
 * Check if two time ranges overlap
 * @param start1 - Start time of first range
 * @param end1 - End time of first range
 * @param start2 - Start time of second range
 * @param end2 - End time of second range
 * @returns True if ranges overlap
 */
export const doTimeRangesOverlap = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean => {
  return start1 < end2 && end1 > start2;
};

/**
 * Validate that end time is after start time
 * @param startTime - Start time string in HH:MM format
 * @param endTime - End time string in HH:MM format
 * @returns Object with isValid flag and optional error message
 */
export const validateTimeRange = (
  startTime: string,
  endTime: string
): { isValid: boolean; error?: string } => {
  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);

  if (endMinutes <= startMinutes) {
    return {
      isValid: false,
      error: "End time must be after start time",
    };
  }

  return { isValid: true };
};

/**
 * Validate that a time is not in the past for same-day dates
 * Shared utility used by both barber schedule and appointment booking
 * @param timeString - Time string in HH:MM format (e.g., "14:30")
 * @param date - The date to check against (DateTime object)
 * @returns Object with isValid flag and optional error message
 */
export const validatePastTimeOnSameDate = (
  timeString: string,
  date: Date
): { isValid: boolean; error?: string } => {
  const today = startOfDay(new Date());
  const scheduleDate = startOfDay(date);

  // Only validate if the date is today
  if (isSameDay(scheduleDate, today)) {
    const currentMinutes = getCurrentTimeMinutes();
    const timeMinutes = timeStringToMinutes(timeString);

    if (timeMinutes < currentMinutes) {
      return {
        isValid: false,
        error: "Cannot set time in the past for today",
      };
    }
  }

  return { isValid: true };
};
