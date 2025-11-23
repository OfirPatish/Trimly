"use client";

import type { Appointment } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BarberAppointmentCard } from "./BarberAppointmentCard";
import { useMemo } from "react";
import { format } from "date-fns";
import { formatDateToString } from "@/utils/time";

interface BarberAppointmentsListProps {
  appointments: Appointment[];
  showSections?: boolean;
  upcomingAppointments?: Appointment[];
  pastAppointments?: Appointment[];
  statusFilter?: "cancelled" | "all";
  dateFilter?: string;
  onCancel?: (id: string) => void;
  className?: string;
}

export function BarberAppointmentsList({
  appointments,
  showSections = false,
  upcomingAppointments,
  pastAppointments,
  statusFilter = "all",
  dateFilter = "all",
  onCancel,
  className,
}: BarberAppointmentsListProps) {
  const now = useMemo(() => new Date(), []);

  // Helper function to group appointments by date
  const groupAppointmentsByDate = (appointmentsList: Appointment[]) => {
    const grouped = new Map<string, Appointment[]>();
    appointmentsList.forEach((apt) => {
      const date = formatDateToString(new Date(apt.appointmentDate));
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(apt);
    });
    // Sort appointments within each date group by time
    grouped.forEach((apts) => {
      apts.sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );
    });
    return grouped;
  };

  // Determine if we should show sectioned layout
  const shouldShowSections =
    showSections &&
    upcomingAppointments !== undefined &&
    pastAppointments !== undefined &&
    statusFilter === "all" &&
    (dateFilter === "all" || dateFilter === "today");

  // Helper function to render appointments grouped by date
  const renderAppointmentsByDate = (
    appointmentsList: Appointment[],
    defaultIsPast: boolean = false
  ) => {
    const grouped = groupAppointmentsByDate(appointmentsList);

    return Array.from(grouped.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, dateAppointments]) => {
        const displayDate = format(new Date(date), "EEEE, MMMM d, yyyy");

        return (
          <div key={date} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h3 className="text-base font-semibold text-foreground">
                {displayDate}
              </h3>
              <Badge variant="secondary" className="text-xs font-medium">
                {dateAppointments.length}
              </Badge>
            </div>

            {/* Appointments for this date */}
            <div className="space-y-4 pl-2">
              {dateAppointments.map((appointment) => {
                const appointmentIsPast =
                  defaultIsPast ||
                  new Date(appointment.appointmentDate) < now ||
                  appointment.status === "cancelled";
                return (
                  <BarberAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isPast={appointmentIsPast}
                    onCancel={onCancel}
                  />
                );
              })}
            </div>
          </div>
        );
      });
  };

  // If showing sections, render upcoming/past layout
  if (shouldShowSections) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        {upcomingAppointments && upcomingAppointments.length > 0 && (
          <div>
            <div className="mb-5 pb-3 border-b border-border/50">
              <h2 className="text-lg font-semibold mb-1.5">Upcoming</h2>
              <p className="text-sm text-muted-foreground">
                {upcomingAppointments.length}{" "}
                {upcomingAppointments.length !== 1
                  ? "appointments"
                  : "appointment"}
              </p>
            </div>
            <div className="space-y-6">
              {renderAppointmentsByDate(upcomingAppointments)}
            </div>
          </div>
        )}

        {pastAppointments && pastAppointments.length > 0 && (
          <>
            {upcomingAppointments && upcomingAppointments.length > 0 && (
              <Separator className="my-6" />
            )}
            <div>
              <div className="mb-5 pb-3 border-b border-border/50">
                <h2 className="text-lg font-semibold mb-1.5">Past</h2>
                <p className="text-sm text-muted-foreground">
                  {pastAppointments.length} previous{" "}
                  {pastAppointments.length !== 1
                    ? "appointments"
                    : "appointment"}
                </p>
              </div>
              <div className="space-y-6">
                {renderAppointmentsByDate(pastAppointments, true)}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Simple list layout (filtered view or default) - Group by date
  if (appointments.length === 0) {
    return null;
  }

  const appointmentsByDate = groupAppointmentsByDate(appointments);

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {Array.from(appointmentsByDate.entries())
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, dateAppointments]) => {
          const displayDate = format(new Date(date), "EEEE, MMMM d, yyyy");

          return (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <h3 className="text-lg font-semibold text-foreground">
                  {displayDate}
                </h3>
                <Badge variant="secondary" className="font-medium">
                  {dateAppointments.length}{" "}
                  {dateAppointments.length === 1
                    ? "appointment"
                    : "appointments"}
                </Badge>
              </div>

              {/* Appointments for this date */}
              <div className="space-y-4 pl-2">
                {dateAppointments.map((appointment) => {
                  const appointmentIsPast =
                    new Date(appointment.appointmentDate) < now ||
                    appointment.status === "cancelled";
                  return (
                    <BarberAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isPast={appointmentIsPast}
                      onCancel={onCancel}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
