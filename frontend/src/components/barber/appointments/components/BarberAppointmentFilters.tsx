"use client";

import { AppointmentFilters } from "@/components/shared";

type DateFilter = "all" | "today" | "week" | "thisWeek" | "thisMonth";
type StatusFilter = "cancelled" | "all";

interface BarberAppointmentFiltersProps<T extends string = DateFilter> {
  dateFilter: T;
  onDateFilterChange: (filter: T) => void;
  dateFilterOptions?: T[];
  statusFilter?: StatusFilter;
  onStatusFilterChange?: (filter: StatusFilter) => void;
  className?: string;
}

export function BarberAppointmentFilters<T extends string = DateFilter>({
  dateFilter,
  onDateFilterChange,
  dateFilterOptions = ["all", "today", "week"] as T[],
  statusFilter,
  onStatusFilterChange,
  className,
}: BarberAppointmentFiltersProps<T>) {
  return (
    <AppointmentFilters
      dateFilter={dateFilter}
      onDateFilterChange={onDateFilterChange}
      dateFilterOptions={dateFilterOptions}
      statusFilter={statusFilter}
      onStatusFilterChange={onStatusFilterChange}
      className={className}
    />
  );
}
