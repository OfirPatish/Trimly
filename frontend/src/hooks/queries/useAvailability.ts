import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAvailability(
  date: string | null,
  barberId: string | null,
  serviceId?: string | null
) {
  return useQuery({
    queryKey: ["availability", date, barberId, serviceId],
    queryFn: async () => {
      if (!date || !barberId) {
        return { availableSlots: [], date: "", barberId: "" };
      }
      return api.getAvailability(date, barberId, serviceId || undefined);
    },
    enabled: !!date && !!barberId,
    staleTime: 0, // Always refetch when serviceId changes to get accurate availability based on service duration
    // Don't use placeholderData when serviceId changes - we need fresh data for accurate slot availability
    placeholderData: (previousData, query) => {
      if (!query) return undefined;

      // Only use placeholder data if we're switching dates/barbers (not services)
      // When serviceId changes, we need fresh data because different services have different durations
      const prevQueryKey = query.queryKey as [
        string,
        string | null,
        string | null,
        string | null | undefined
      ];
      const prevServiceId = prevQueryKey[3];

      // If serviceId changed, don't use placeholder (show loading to get fresh data)
      if (prevServiceId !== serviceId) {
        return undefined;
      }

      // Otherwise, keep previous data for smooth transitions when only date/barber changes
      return previousData;
    },
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
