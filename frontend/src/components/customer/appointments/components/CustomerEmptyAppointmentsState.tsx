"use client";

import { EmptyAppointmentsState } from "@/components/shared";

interface CustomerEmptyAppointmentsStateProps {
  title?: string;
  description?: string;
  hasFilters?: boolean;
  showActionButton?: boolean;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

export function CustomerEmptyAppointmentsState({
  title,
  description,
  hasFilters = false,
  showActionButton = false,
  actionLabel = "Book Your First Appointment",
  onActionClick,
  className,
}: CustomerEmptyAppointmentsStateProps) {
  return (
    <EmptyAppointmentsState
      title={title}
      description={description}
      hasFilters={hasFilters}
      showActionButton={showActionButton}
      actionLabel={actionLabel}
      onActionClick={onActionClick}
      className={className}
      variant="customer"
    />
  );
}
