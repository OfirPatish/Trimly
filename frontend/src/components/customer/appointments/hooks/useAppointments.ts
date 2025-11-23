import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export function useAppointments() {
  const isAuthenticated = useAuthStore((state) => !!state.user);

  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { appointments } = await api.getAppointments();
      return appointments;
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    refetchOnMount: true, // Refetch when component mounts (e.g., after login)
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.deleteAppointment(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      // Invalidate all availability queries so time slots refresh immediately
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Parameters<typeof api.createAppointment>[0]) => {
      const result = await api.createAppointment(data);
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      // Invalidate all availability queries so they refresh when modal reopens
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}
