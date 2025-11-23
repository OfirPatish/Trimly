/**
 * Appointment filtering utilities
 */

import type { Appointment } from "@/types";
import {
  matchesDateFilter,
  getTodayRange,
  type DateFilterType,
} from "./dateFilters";

export type StatusFilterType = Appointment["status"] | "all";

interface FilterAppointmentsOptions {
  appointments: Appointment[];
  dateFilter?: DateFilterType;
  statusFilter?: StatusFilterType;
  barberFilter?: string | null;
  onlyUpcoming?: boolean; // For customer view - only show future appointments
}

/**
 * Filter appointments based on multiple criteria
 */
export function filterAppointments({
  appointments,
  dateFilter = "all",
  statusFilter = "all",
  barberFilter = null,
  onlyUpcoming = false,
}: FilterAppointmentsOptions): Appointment[] {
  const now = new Date();

  return appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);

    // Base filter: only upcoming appointments (for customer view)
    if (onlyUpcoming) {
      if (
        appointmentDate < now ||
        appointment.status === "cancelled"
      ) {
        return false;
      }
    }

    // Status filter - only filter by cancelled, active appointments have null status
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false;
    }

    // Date filter
    if (!matchesDateFilter(appointmentDate, dateFilter)) {
      return false;
    }

    // Barber filter
    if (barberFilter !== null && appointment.barber?.id !== barberFilter) {
      return false;
    }

    return true;
  });
}

/**
 * Separate appointments into upcoming and past
 */
export function separateAppointmentsByTime(appointments: Appointment[]) {
  const now = new Date();

  const upcoming: Appointment[] = [];
  const past: Appointment[] = [];

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const appointmentEndTime = new Date(appointmentDate);

    // Calculate end time using service duration
    const duration =
      appointment.duration || appointment.service?.duration || 30;
    appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + duration);

    if (appointmentEndTime >= now && appointment.status !== "cancelled") {
      upcoming.push(appointment);
    } else {
      past.push(appointment);
    }
  });

  return { upcoming, past };
}

/**
 * Get today's appointments
 */
export function getTodayAppointments(
  appointments: Appointment[]
): Appointment[] {
  const { start, end } = getTodayRange();

  return appointments
    .filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= start && aptDate <= end && apt.status !== "cancelled";
    })
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );
}
