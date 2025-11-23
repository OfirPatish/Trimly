import {
  Scissors,
  User,
  TrendingUp,
  Sparkles,
  Layers,
  Zap,
  Star,
  Crown,
  LucideIcon,
} from "lucide-react";
import type { Service } from "@/hooks/queries/useServices";

/**
 * Booking rules and constraints
 * These should match the backend constants in backend/src/services/appointments/constants.ts
 */
export const BOOKING_RULES = {
  MAX_ADVANCE_BOOKING_MONTHS: 3,
  SAME_DAY_ADVANCE_BOOKING_MINUTES: 15,
  CANCELLATION_DEADLINE_HOURS: 1,
  MAX_APPOINTMENTS_PER_DAY: 2,
} as const;

/**
 * Frontend UI metadata for services (icons, display labels)
 * This maps service IDs to their UI components
 *
 * When adding a new service through the barber dashboard, add its metadata here
 * to ensure it displays with the correct icon and label.
 *
 * Common service IDs to pre-configure:
 * - classic-cut, fade-cut, buzz-cut, crew-cut, pompadour, undercut, etc.
 */
export const SERVICE_UI_METADATA: Record<
  string,
  { icon: LucideIcon; label: string }
> = {
  // Classic & Standard Cuts
  "classic-cut": {
    icon: Scissors,
    label: "Classic Cut",
  },
  haircut: {
    icon: Scissors,
    label: "Haircut",
  },
  "standard-cut": {
    icon: Scissors,
    label: "Standard Cut",
  },

  // Fade Styles
  "fade-cut": {
    icon: TrendingUp,
    label: "Fade",
  },
  "high-fade": {
    icon: TrendingUp,
    label: "High Fade",
  },
  "low-fade": {
    icon: TrendingUp,
    label: "Low Fade",
  },
  "mid-fade": {
    icon: TrendingUp,
    label: "Mid Fade",
  },
  "skin-fade": {
    icon: TrendingUp,
    label: "Skin Fade",
  },

  // Short Cuts
  "buzz-cut": {
    icon: Zap,
    label: "Buzz Cut",
  },
  "crew-cut": {
    icon: Zap,
    label: "Crew Cut",
  },
  "pixie-cut": {
    icon: Zap,
    label: "Pixie Cut",
  },

  // Styled Cuts
  pompadour: {
    icon: Crown,
    label: "Pompadour",
  },
  undercut: {
    icon: Layers,
    label: "Undercut",
  },
  quiff: {
    icon: Star,
    label: "Quiff",
  },
  "slick-back": {
    icon: Sparkles,
    label: "Slick Back",
  },

  // Beard Services
  "beard-trim": {
    icon: User,
    label: "Beard Trim",
  },
  "beard-shape": {
    icon: User,
    label: "Beard Shape",
  },
  "full-beard": {
    icon: User,
    label: "Full Beard",
  },
  "mustache-trim": {
    icon: User,
    label: "Mustache Trim",
  },

  // Combination Services
  "cut-and-beard": {
    icon: Scissors,
    label: "Cut & Beard",
  },
  "hair-and-beard": {
    icon: Scissors,
    label: "Hair & Beard",
  },
};

/**
 * User-friendly booking information message
 */
export const BOOKING_INFO_MESSAGE = `📅 Book up to ${BOOKING_RULES.MAX_ADVANCE_BOOKING_MONTHS} months in advance\n⏰ Same-day bookings need at least ${BOOKING_RULES.SAME_DAY_ADVANCE_BOOKING_MINUTES} minutes notice\n❌ Cancel at least ${BOOKING_RULES.CANCELLATION_DEADLINE_HOURS} hour before your appointment`;

/**
 * Merges backend service data with frontend UI metadata
 * This creates the complete service option with price from backend and icon/label from frontend
 */
export function mergeServicesWithUI(services: Service[]) {
  return services.map((service) => {
    const uiMetadata = SERVICE_UI_METADATA[service.id];
    return {
      id: service.id,
      value: service.id, // Alias for id (used in some components)
      label: uiMetadata?.label || service.name,
      name: service.name, // Backend name
      icon: uiMetadata?.icon || Scissors, // Default icon if not found
      price: service.price, // From backend - single source of truth
      duration: service.duration, // From backend
    };
  });
}
