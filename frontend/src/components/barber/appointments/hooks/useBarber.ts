import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import type { Appointment } from "@/types";

export function useBarberAppointments() {
  const isBarber = useAuthStore((state) => state.user?.role === "barber");

  return useQuery({
    queryKey: ["barber", "appointments"],
    queryFn: () => api.getBarberAppointments(), // Always fetch all appointments
    enabled: isBarber, // Only fetch when user is barber
    staleTime: 30000, // 30 seconds
  });
}

export function useUpdateBarberAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "cancelled" }) =>
      api.updateBarberAppointmentStatus(id, status),
    onSuccess: () => {
      // Invalidate barber appointments
      queryClient.invalidateQueries({ queryKey: ["barber", "appointments"] });
      // Also invalidate user appointments in case barber updated status
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      // Invalidate availability queries so time slots refresh when status changes (e.g., cancelled)
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}
