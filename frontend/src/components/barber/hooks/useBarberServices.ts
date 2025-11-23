import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Appointment } from "@/types";

export function useAllAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { appointments } = await api.getAppointments();
      return appointments;
    },
    staleTime: 30000, // 30 seconds
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      serviceId: string;
      name: string;
      price: number;
      duration: number;
    }) => api.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", "all"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      data,
    }: {
      serviceId: string;
      data: { name: string; price: number; duration: number };
    }) => api.updateService(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", "all"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => api.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", "all"] });
    },
  });
}

export function useRestoreService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => api.restoreService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", "all"] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "cancelled";
    }) => api.updateBarberAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["barber", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}
