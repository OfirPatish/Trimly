import prisma from "../../config/database.js";
import {
  SLOT_DURATION_MINUTES,
  SAME_DAY_ADVANCE_BOOKING_MINUTES,
} from "./constants.js";
import {
  getSlotsForService,
  isValidSlotTime,
  timeStringToMinutes,
  getAppointmentDuration,
  getSameDayDateRange,
  parseTimeSlot,
} from "./utils.js";
import {
  startOfDay,
  isSameDay,
  getHours,
  getMinutes,
  addMinutes,
  format,
} from "date-fns";

/**
 * Check if consecutive slots are available for multi-slot services
 */
function areConsecutiveSlotsAvailable(
  slot: string,
  slotsNeeded: number,
  allSlots: string[],
  bookedSlots: Set<string>,
  dateStart: Date
): boolean {
  const { hours, minutes } = parseTimeSlot(slot);
  const slotDateTime = new Date(dateStart);
  slotDateTime.setHours(hours, minutes, 0, 0);

  // Check if all required consecutive slots are available
  for (let i = 0; i < slotsNeeded; i++) {
    const checkTime = addMinutes(slotDateTime, i * SLOT_DURATION_MINUTES);
    const checkSlotString = format(checkTime, "HH:mm");

    // Check if this slot exists in schedule and is not booked
    if (
      !allSlots.includes(checkSlotString) ||
      bookedSlots.has(checkSlotString)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a slot is too soon for same-day booking
 */
function isSlotTooSoon(
  slot: string,
  dateStart: Date,
  minBookingTime: Date
): boolean {
  const { hours, minutes } = parseTimeSlot(slot);
  const slotDateTime = new Date(dateStart);
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime <= minBookingTime;
}

/**
 * Generate time slots between start and end time in 20-minute intervals
 * @param startTime - Start time in HH:MM format (e.g., "09:00")
 * @param endTime - End time in HH:MM format (e.g., "17:00")
 * @returns Array of time slot strings in HH:MM format
 */
function generateSlotsFromSchedule(
  startTime: string,
  endTime: string
): string[] {
  const slots: string[] = [];
  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);

  // Generate slots in 20-minute intervals
  for (
    let minutes = startMinutes;
    minutes < endMinutes;
    minutes += SLOT_DURATION_MINUTES
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeString = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    slots.push(timeString);
  }

  return slots;
}

/**
 * Get available time slots for a barber on a specific date from their schedule
 * @param dateString - Date string in YYYY-MM-DD format
 * @param barberId - The barber ID
 * @returns Array of time slot strings in HH:MM format, sorted chronologically
 */
export const getBarberAvailableSlotsByString = async (
  dateString: string,
  barberId: string
): Promise<string[]> => {
  // Convert date string to DateTime (date only, time set to midnight UTC)
  const date = new Date(dateString + "T00:00:00.000Z");

  const schedule = await prisma.barberSchedule.findUnique({
    where: {
      barberId_date: {
        barberId,
        date,
      },
    },
  });

  // If no schedule exists or schedule is inactive, return empty array
  if (!schedule || !schedule.isActive) {
    return [];
  }

  // Generate slots from schedule start and end times
  return generateSlotsFromSchedule(schedule.startTime, schedule.endTime);
};

/**
 * Calculate available time slots for a specific date and barber
 * Filters out booked slots and ensures consecutive slots are available for multi-slot services
 * @param dateString - Date string in YYYY-MM-DD format
 * @param barberId - The barber ID
 * @param serviceId - Optional service ID to check availability for (uses service duration)
 * @returns Array of available time slot strings in HH:MM format
 */
export const getAvailableTimeSlots = async (
  dateString: string,
  barberId: string,
  serviceId?: string
): Promise<string[]> => {
  // Parse date string to Date object only for appointment queries (appointments use DateTime)
  const [year, month, day] = dateString.split("-").map(Number);
  const dateStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const { end: dateEnd } = getSameDayDateRange(dateStart);

  // Get the service duration if serviceId is provided
  let requestedServiceDuration = SLOT_DURATION_MINUTES; // Default to 20 minutes (1 slot)
  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { serviceId },
      select: { duration: true, isActive: true },
    });
    if (service && service.isActive) {
      requestedServiceDuration = service.duration;
    }
  }

  // Calculate how many slots this service needs
  const slotsNeeded = getSlotsForService(requestedServiceDuration);

  // Get all non-cancelled appointments for this date and barber
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId: barberId,
      appointmentDate: {
        gte: dateStart,
        lt: dateEnd,
      },
      status: {
        not: "cancelled",
      },
    },
    include: {
      service: {
        select: {
          duration: true,
        },
      },
    },
    orderBy: {
      appointmentDate: "asc",
    },
  });

  // Create a set of booked slot times
  const bookedSlots = new Set<string>();

  appointments.forEach((apt) => {
    const aptDate = new Date(apt.appointmentDate);

    // Verify this appointment is actually on the requested date
    if (!isSameDay(aptDate, dateStart)) {
      return; // Skip appointments not on the requested date
    }

    // Use stored duration (snapshot) if available, otherwise fall back to service duration or default
    const appointmentDuration = getAppointmentDuration(
      apt,
      SLOT_DURATION_MINUTES
    );
    const aptSlotsNeeded = getSlotsForService(appointmentDuration);

    // Extract hour and minute from the appointment start time
    const hour = getHours(aptDate);
    const minute = getMinutes(aptDate);

    // Create base slot time
    let slotTime = new Date(dateStart);
    slotTime.setHours(hour, minute, 0, 0);

    // Mark all slots used by this appointment as booked
    for (let i = 0; i < aptSlotsNeeded; i++) {
      const currentSlotTime = addMinutes(slotTime, i * SLOT_DURATION_MINUTES);

      // Only mark valid slot times (should always be valid, but safety check)
      if (isValidSlotTime(currentSlotTime)) {
        const slotString = format(currentSlotTime, "HH:mm");
        bookedSlots.add(slotString);
      }
    }
  });

  // Get available time slots for this barber and date from their schedule
  const allSlots = await getBarberAvailableSlotsByString(dateString, barberId);

  // Filter out booked slots and check same-day advance booking
  const now = new Date();
  const today = startOfDay(now);
  const isToday = isSameDay(dateStart, today);
  const minBookingTime = isToday
    ? addMinutes(now, SAME_DAY_ADVANCE_BOOKING_MINUTES)
    : null;

  const filteredSlots = allSlots.filter((slot) => {
    // Check if this slot is booked
    if (bookedSlots.has(slot)) {
      return false;
    }

    // For services that need multiple slots, check if all consecutive slots are available
    if (
      slotsNeeded > 1 &&
      !areConsecutiveSlotsAvailable(
        slot,
        slotsNeeded,
        allSlots,
        bookedSlots,
        dateStart
      )
    ) {
      return false;
    }

    // For same-day bookings, filter out slots that start too soon
    if (
      isToday &&
      minBookingTime &&
      isSlotTooSoon(slot, dateStart, minBookingTime)
    ) {
      return false;
    }

    return true;
  });

  return filteredSlots;
};
