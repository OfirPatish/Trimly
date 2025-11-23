"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ConfirmDialog, SectionCard, PageHeader } from "@/components/shared";
import {
  CustomerAppointmentsList,
  CustomerEmptyAppointmentsState,
} from "./components";
import { InlineBooking } from "@/components/customer/booking";
import {
  useAppointments,
  useDeleteAppointment,
} from "./hooks";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export function UpcomingAppointments() {
  const { user } = useAuthStore();
  const { data: appointments = [] } = useAppointments();
  const deleteAppointmentMutation = useDeleteAppointment();

  // Filter to only show upcoming appointments (not cancelled)
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        // Show all upcoming appointments (exclude cancelled)
        return appointmentDate >= now && appointment.status !== "cancelled";
      })
      .sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );
  }, [appointments]);

  const canBookMore = upcomingAppointments.length < 2;

  // Use confirm dialog hook
  const confirmDialog = useConfirmDialog({
    onConfirm: async (id: string) => {
      await deleteAppointmentMutation.mutateAsync(id);
    },
  });

  return (
    <>
      <PageHeader
        title="My Appointments"
        description={
          <>
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {user?.name || "Guest"}
            </span>
            !{" "}
            {canBookMore
              ? "Book your appointment below."
              : "You have reached the maximum of 2 appointments."}
          </>
        }
        icon={Calendar}
      />

      {/* Booking Section - Only show if can book more */}
      {canBookMore && (
        <div className="mb-6">
          <InlineBooking
            onBookingComplete={() => {
              // Appointments will refresh automatically via React Query
            }}
          />
        </div>
      )}

      {/* Appointments List */}
      <SectionCard
        title="Upcoming Appointments"
        description={
          upcomingAppointments.length === 0
            ? "No upcoming appointments"
            : `${upcomingAppointments.length} appointment${
                upcomingAppointments.length === 1 ? "" : "s"
              }`
        }
      >
        {upcomingAppointments.length === 0 ? (
          <CustomerEmptyAppointmentsState
            showActionButton={canBookMore}
            onActionClick={() => {
              // Scroll to top where booking form is
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <CustomerAppointmentsList
            appointments={upcomingAppointments}
            onDelete={confirmDialog.handleOpen}
          />
        )}
      </SectionCard>

      <ConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.handleClose}
        onConfirm={confirmDialog.handleConfirm}
        title="Cancel Appointment?"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel Appointment"
        cancelText="Keep Appointment"
        variant="destructive"
        loading={deleteAppointmentMutation.isPending}
        error={confirmDialog.error}
      />
    </>
  );
}

