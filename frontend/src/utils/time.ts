import { format, parse, isSameDay } from "date-fns";

// Constants
export const SLOT_DURATION_MINUTES = 20; // Each time slot is 20 minutes

/**
 * Format a time slot string (HH:MM) to 12-hour format (h:mm a)
 * This ensures consistent time display across the application
 * @param slot - Time slot in HH:MM format (e.g., "09:00", "14:30")
 * @returns Formatted time string (e.g., "9:00 AM", "2:30 PM")
 */
export function formatTimeSlot(slot: string): string {
  // Parse HH:MM format and format as 12-hour time with AM/PM
  // Use a reference date to avoid timezone issues
  const timeDate = parse(slot, "HH:mm", new Date(2000, 0, 1));
  return format(timeDate, "h:mm a");
}

/**
 * Parse a time slot string (HH:MM) to get hours and minutes
 * @param slot - Time slot in HH:MM format
 * @returns Object with hours and minutes as numbers
 */
export function parseTimeSlot(slot: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = slot.split(":").map(Number);
  return { hours, minutes };
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 * @param time - Time string in HH:MM format (e.g., "14:30")
 * @returns Minutes since midnight (e.g., 870 for "14:30")
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current time in minutes since midnight
 * @returns Current time in minutes since midnight
 */
export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Check if two time ranges overlap
 * @param start1 - Start time in minutes since midnight
 * @param end1 - End time in minutes since midnight
 * @param start2 - Start time in minutes since midnight
 * @param end2 - End time in minutes since midnight
 * @returns True if ranges overlap
 */
export function doTimeRangesOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return start1 < end2 && end1 > start2;
}

/**
 * Check if a time slot overlaps with an appointment
 * @param slotTime - Slot start time in HH:MM format
 * @param slotDuration - Slot duration in minutes
 * @param aptStartTime - Appointment start time in HH:MM format
 * @param aptDuration - Appointment duration in minutes
 * @returns True if slot overlaps with appointment
 */
export function isSlotOverlapping(
  slotTime: string,
  slotDuration: number,
  aptStartTime: string,
  aptDuration: number
): boolean {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + slotDuration;
  const aptStart = timeToMinutes(aptStartTime);
  const aptEnd = aptStart + aptDuration;

  return doTimeRangesOverlap(slotStart, slotEnd, aptStart, aptEnd);
}

/**
 * Check if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are on the same day
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Get start of day (sets hours, minutes, seconds, milliseconds to 0)
 * @param date - Date to get start of day for
 * @returns New date with time set to 00:00:00.000
 */
export function getStartOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Format a Date object's time to HH:MM string format
 * @param date - Date object to extract time from
 * @returns Time string in HH:MM format (e.g., "14:30")
 */
export function formatDateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Format a date to YYYY-MM-DD string format
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateToString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Get the next available slot time (rounds up to nearest slot)
 * @param currentMinutes - Current time in minutes since midnight
 * @returns Next slot time in minutes since midnight
 */
export function getNextSlotMinutes(currentMinutes: number): number {
  return (
    Math.ceil(currentMinutes / SLOT_DURATION_MINUTES) * SLOT_DURATION_MINUTES
  );
}
