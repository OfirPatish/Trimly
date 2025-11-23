"use client";

import type { Appointment } from "@/types";
import { CustomerAppointmentCard } from "./CustomerAppointmentCard";
import { useMemo } from "react";

interface CustomerAppointmentsListProps {
  appointments: Appointment[];
  onDelete?: (id: string) => void;
  className?: string;
}

export function CustomerAppointmentsList({
  appointments,
  onDelete,
  className,
}: CustomerAppointmentsListProps) {
  const now = useMemo(() => new Date(), []);

  if (appointments.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {appointments.map((appointment) => {
        const appointmentIsPast =
          new Date(appointment.appointmentDate) < now ||
          appointment.status === "cancelled";
        return (
          <CustomerAppointmentCard
            key={appointment.id}
            appointment={appointment}
            isPast={appointmentIsPast}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}

