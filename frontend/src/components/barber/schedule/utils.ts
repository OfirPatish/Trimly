import {
  timeToMinutes,
  getCurrentTimeMinutes,
  formatTimeSlot,
} from "@/utils/time";

// Generate time slots from 6 AM to 11 PM in 20-minute intervals
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 6; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 20) {
      if (hour === 23 && minute > 0) break; // Stop at 23:00
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
}

export const ALL_TIME_SLOTS = generateTimeSlots();

// Re-export formatTimeSlot with alias for backward compatibility
export const formatTime = formatTimeSlot;

// Re-export time utilities for backward compatibility
export {
  timeToMinutes,
  getCurrentTimeMinutes,
  getNextSlotMinutes,
} from "@/utils/time";

export function validateScheduleTimes(
  startTime: string,
  endTime: string,
  isToday: boolean
): { isValid: boolean; error?: string } {
  if (!startTime || !endTime) {
    return { isValid: false };
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (endMinutes <= startMinutes) {
    return { isValid: false, error: "End time must be after start time" };
  }

  if (isToday) {
    const currentTimeMinutes = getCurrentTimeMinutes();
    if (startMinutes < currentTimeMinutes) {
      return {
        isValid: false,
        error: "Cannot set start time in the past for today",
      };
    }
  }

  return { isValid: true };
}

