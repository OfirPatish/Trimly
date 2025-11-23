import type { Appointment } from "@/types";
import { BarberAppointmentCard } from "@/components/barber/appointments";

interface BarberTodayScheduleProps {
  appointments: Appointment[];
  onCancel?: (id: string) => void;
}

export function BarberTodaySchedule({
  appointments,
  onCancel,
}: BarberTodayScheduleProps) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Today&apos;s Schedule</h2>
        <p className="text-sm text-muted-foreground">
          {appointments.length}{" "}
          {appointments.length !== 1 ? "appointments" : "appointment"} scheduled
        </p>
      </div>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <BarberAppointmentCard
            key={appointment.id}
            appointment={appointment}
            showTimeBadge={true}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
}
