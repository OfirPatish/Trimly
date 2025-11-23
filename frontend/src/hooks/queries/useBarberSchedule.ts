import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateScheduleData, UpdateScheduleData } from "@/types";

export function useBarberSchedule(date: string) {
  return useQuery({
    queryKey: ["barberSchedule", date],
    queryFn: async () => {
      const data = await api.getBarberSchedule(date);
      return data;
    },
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useBarberSchedules(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["barberSchedules", params?.startDate, params?.endDate],
    queryFn: async () => {
      const data = await api.getBarberSchedules(params);
      return data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateBarberSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateScheduleData) => {
      return api.createBarberSchedule(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate schedule queries
      queryClient.invalidateQueries({
        queryKey: ["barberSchedule", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["barberSchedules"],
      });
      // Also invalidate customer availability queries
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useUpdateBarberSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scheduleId,
      data,
    }: {
      scheduleId: string;
      data: UpdateScheduleData;
    }) => {
      return api.updateBarberSchedule(scheduleId, data);
    },
    onSuccess: () => {
      // Invalidate all schedule queries
      queryClient.invalidateQueries({
        queryKey: ["barberSchedule"],
      });
      queryClient.invalidateQueries({
        queryKey: ["barberSchedules"],
      });
      // Also invalidate customer availability queries
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useDeleteBarberSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      return api.deleteBarberSchedule(scheduleId);
    },
    onSuccess: () => {
      // Invalidate all schedule queries
      queryClient.invalidateQueries({
        queryKey: ["barberSchedule"],
      });
      queryClient.invalidateQueries({
        queryKey: ["barberSchedules"],
      });
      // Also invalidate customer availability queries
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}
