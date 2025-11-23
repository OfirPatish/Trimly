/**
 * Maps appointment status to badge variant for UI display.
 * Only cancelled appointments have a status, active appointments are null.
 */
export function getStatusVariant(
  status: string | null
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "cancelled") {
    return "destructive";
  }
  // Active appointments (null status) - no badge needed, but return secondary as fallback
  return "secondary";
}
