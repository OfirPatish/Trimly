"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";
import { useMemo } from "react";

type DateFilter = "all" | "today" | "week" | "thisWeek" | "thisMonth";
type StatusFilter = "cancelled" | "all";

interface AppointmentFiltersProps<T extends string = DateFilter> {
  dateFilter: T;
  onDateFilterChange: (filter: T) => void;
  dateFilterOptions?: T[];
  statusFilter?: StatusFilter;
  onStatusFilterChange?: (filter: StatusFilter) => void;
  className?: string;
}

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: "All Time",
  today: "Today",
  week: "This Week",
  thisWeek: "This Week",
  thisMonth: "This Month",
};

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cancelled", label: "Cancelled" },
];

// Filter group component
function FilterGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground shrink-0">
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

// Filter button component
function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      size="sm"
      className={cn(
        "transition-all duration-200 font-medium",
        isActive && "shadow-sm"
      )}
    >
      {label}
    </Button>
  );
}

export function AppointmentFilters<T extends string = DateFilter>({
  dateFilter,
  onDateFilterChange,
  dateFilterOptions = ["all", "today", "week"] as T[],
  statusFilter,
  onStatusFilterChange,
  className,
}: AppointmentFiltersProps<T>) {
  // Check if any filters are active
  const hasActiveDateFilter = dateFilter && dateFilter !== "all";
  const hasActiveStatusFilter =
    statusFilter !== undefined && statusFilter !== "all";
  const hasActiveFilters = hasActiveDateFilter || hasActiveStatusFilter;

  const clearFilters = () => {
    onDateFilterChange("all" as T);
    onStatusFilterChange?.("all");
  };

  return (
    <div className={cn("mb-6", className)}>
      <div className="space-y-5 p-4 bg-muted/30 rounded-lg border border-border/50">
        {/* Date Filters */}
        {dateFilterOptions && dateFilterOptions.length > 0 && (
          <FilterGroup label="Date Range" icon={Calendar}>
            {dateFilterOptions.map((filter) => (
              <FilterButton
                key={filter}
                label={DATE_FILTER_LABELS[filter as DateFilter] || filter}
                isActive={dateFilter === filter}
                onClick={() => onDateFilterChange(filter as T)}
              />
            ))}
          </FilterGroup>
        )}

        {/* Status Filters */}
        {onStatusFilterChange && statusFilter !== undefined && (
          <FilterGroup label="Status" icon={Filter}>
            {STATUS_FILTERS.map((filter) => (
              <FilterButton
                key={filter.value}
                label={filter.label}
                isActive={statusFilter === filter.value}
                onClick={() => onStatusFilterChange(filter.value)}
              />
            ))}
          </FilterGroup>
        )}

        {/* Active Filters Indicator & Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-border/50">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Active:</span>
              <div className="flex flex-wrap gap-2">
                {hasActiveDateFilter && (
                  <Badge variant="secondary" className="font-medium">
                    {DATE_FILTER_LABELS[dateFilter as DateFilter] || dateFilter}
                  </Badge>
                )}
                {hasActiveStatusFilter && (
                  <Badge variant="secondary" className="font-medium">
                    {
                      STATUS_FILTERS.find((f) => f.value === statusFilter)
                        ?.label
                    }
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

