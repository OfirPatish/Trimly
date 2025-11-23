/**
 * Formats an appointment date string into a human-readable date and time.
 * Returns full weekday and month name (e.g., "Monday, January 15").
 */
export function formatAppointmentDate(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/**
 * Formats a date string into a compact date and time.
 * Returns short month name (e.g., "Jan 15, 2024").
 */
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
