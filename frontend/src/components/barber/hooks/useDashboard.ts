import { useState, useMemo } from "react";
import { useBarberAppointments } from "../appointments/hooks";
import { useAllAppointments } from "./useBarberServices";
import { useServices } from "@/hooks/queries/useServices";
import {
  filterAppointments,
  separateAppointmentsByTime,
  getTodayAppointments,
} from "@/utils/appointmentFilters";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { getTodayRange } from "@/utils/dateFilters";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DateFilter = "today" | "week" | "thisMonth" | "all";
type StatusFilter = "cancelled" | "all";

export function useDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  // Fetch barber's own appointments (per-barber stats)
  const { data: barberAppointmentsData } = useBarberAppointments();
  // Also fetch all appointments for services management
  const { data: allAppointmentsData } = useAllAppointments();
  const { data: servicesData } = useServices();

  const queryClient = useQueryClient();
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "cancelled" }) => {
      return api.updateBarberAppointmentStatus(id, status);
    },
    onSuccess: () => {
      // Invalidate barber appointments (used by useBarberAppointments)
      queryClient.invalidateQueries({ queryKey: ["barber", "appointments"] });
      // Also invalidate user appointments in case barber updated status
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      // Invalidate availability queries so time slots refresh when status changes
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  // Use barber's own appointments for stats and display (per-barber view)
  const barberAppointments = useMemo(
    () => barberAppointmentsData?.appointments || [],
    [barberAppointmentsData]
  );

  // Use all appointments for services management
  const allAppointments = useMemo(
    () => allAppointmentsData || [],
    [allAppointmentsData]
  );

  const services = useMemo(() => servicesData || [], [servicesData]);

  // Filter barber's appointments by status and date
  const appointments = useMemo(() => {
    return filterAppointments({
      appointments: barberAppointments,
      dateFilter,
      statusFilter,
    });
  }, [barberAppointments, statusFilter, dateFilter]);

  // Calculate stats from barber's own appointments (per-barber stats)
  const stats = useMemo(() => {
    const now = new Date();
    const { start: todayStart, end: todayEnd } = getTodayRange();

    const todayAppointments = barberAppointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return (
        aptDate >= todayStart &&
        aptDate <= todayEnd &&
        apt.status !== "cancelled"
      );
    });

    const upcomingAppointments = barberAppointments.filter(
      (apt) =>
        new Date(apt.appointmentDate) >= now && apt.status !== "cancelled"
    );

    // Past appointments (completed) - determined by date, not status
    const completedAppointments = barberAppointments.filter(
      (apt) => new Date(apt.appointmentDate) < now && apt.status !== "cancelled"
    );

    const todayCompleted = todayAppointments.filter(
      (apt) => new Date(apt.appointmentDate) < now && apt.status !== "cancelled"
    );

    // Calculate revenue from past appointments (completed)
    const revenue = completedAppointments.reduce((sum, apt) => {
      const price =
        typeof apt.price === "string" ? parseFloat(apt.price) : apt.price || 0;
      return sum + price;
    }, 0);

    const todayRevenue = todayAppointments
      .filter(
        (apt) =>
          new Date(apt.appointmentDate) < now && apt.status !== "cancelled"
      )
      .reduce((sum, apt) => {
        const price =
          typeof apt.price === "string"
            ? parseFloat(apt.price)
            : apt.price || 0;
        return sum + price;
      }, 0);

    const uniqueCustomers = new Set(barberAppointments.map((apt) => apt.userId))
      .size;

    return {
      // Barber's own stats (per-barber)
      today: todayAppointments.length,
      todayCompleted: todayCompleted.length,
      upcoming: upcomingAppointments.length,
      totalAppointments: barberAppointments.length,
      totalRevenue: revenue,
      todayRevenue: todayRevenue,
      totalCustomers: uniqueCustomers,
      // Overall shop stats (for context)
      totalServices: services.length,
    };
  }, [barberAppointments, services]);

  // Separate upcoming and past appointments
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useMemo(() => {
      const appointmentsWithService = appointments.filter(
        (apt) => apt.service?.duration
      );
      return separateAppointmentsByTime(appointmentsWithService);
    }, [appointments]);

  // Get today's appointments
  const todayAppointments = useMemo(() => {
    const appointmentsWithService = appointments.filter(
      (apt) => apt.service?.duration
    );
    return getTodayAppointments(appointmentsWithService);
  }, [appointments]);

  // Use confirm dialog hook
  const confirmDialog = useConfirmDialog({
    onConfirm: async (id: string) => {
      await updateStatusMutation.mutateAsync({
        id,
        status: "cancelled",
      });
    },
  });

  return {
    // Data
    appointments, // Barber's filtered appointments
    allAppointments, // All appointments (for services management)
    barberAppointments, // Barber's own appointments
    stats,
    upcomingAppointments,
    pastAppointments,
    todayAppointments,
    services,

    // Filters
    statusFilter,
    dateFilter,
    setStatusFilter,
    setDateFilter,

    // Cancel dialog
    confirmDialogOpen: confirmDialog.isOpen,
    appointmentToCancel: confirmDialog.item,
    cancelError: confirmDialog.error,
    handleCancelClick: confirmDialog.handleOpen,
    handleCancelConfirm: confirmDialog.handleConfirm,
    handleDialogClose: confirmDialog.handleClose,
    isCancelling: updateStatusMutation.isPending,
  };
}
