import { getStartOfDay } from "./time";

/**
 * Date filtering utilities for appointments
 */

export type DateFilterType =
  | "today"
  | "week"
  | "thisWeek"
  | "thisMonth"
  | "all";

/**
 * Get the start and end dates for "today"
 */
export function getTodayRange() {
  const now = new Date();
  const start = getStartOfDay(now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * Get the start and end dates for "this week" (Sunday to Saturday)
 */
export function getWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay()); // Go back to Sunday
  const startOfDay = getStartOfDay(start);
  const end = new Date(startOfDay);
  end.setDate(end.getDate() + 7); // 7 days later
  return { start: startOfDay, end };
}

/**
 * Get the start and end dates for "this month"
 */
export function getMonthRange() {
  const now = new Date();
  const start = getStartOfDay(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * Check if a date falls within a date filter range
 */
export function matchesDateFilter(
  appointmentDate: string | Date,
  filter: DateFilterType
): boolean {
  if (filter === "all") return true;

  const date = new Date(appointmentDate);

  if (filter === "today") {
    const { start, end } = getTodayRange();
    return date >= start && date <= end;
  }

  if (filter === "week" || filter === "thisWeek") {
    const { start, end } = getWeekRange();
    return date >= start && date < end;
  }

  if (filter === "thisMonth") {
    const { start, end } = getMonthRange();
    return date >= start && date <= end;
  }

  return true;
}
