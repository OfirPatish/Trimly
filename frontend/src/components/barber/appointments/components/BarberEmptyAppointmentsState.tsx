"use client";

import { EmptyAppointmentsState } from "@/components/shared";

interface BarberEmptyAppointmentsStateProps {
  title?: string;
  description?: string;
  hasFilters?: boolean;
  className?: string;
}

export function BarberEmptyAppointmentsState({
  title,
  description,
  hasFilters = false,
  className,
}: BarberEmptyAppointmentsStateProps) {
  return (
    <EmptyAppointmentsState
      title={title}
      description={description}
      hasFilters={hasFilters}
      className={className}
      variant="barber"
    />
  );
}

