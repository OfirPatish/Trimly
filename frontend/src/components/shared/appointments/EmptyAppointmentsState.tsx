"use client";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Calendar, FilterX, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyAppointmentsStateProps {
  title?: string;
  description?: string;
  hasFilters?: boolean;
  showActionButton?: boolean;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
  variant?: "customer" | "barber";
}

export function EmptyAppointmentsState({
  title,
  description,
  hasFilters = false,
  showActionButton = false,
  actionLabel = "Book Appointment",
  onActionClick,
  className,
  variant = "customer",
}: EmptyAppointmentsStateProps) {
  const defaultTitle = hasFilters
    ? "No appointments found"
    : variant === "customer"
    ? "No appointments yet"
    : "No appointments yet";

  const defaultDescription = hasFilters
    ? "Try adjusting your filters to see more appointments."
    : variant === "customer"
    ? "You don't have any appointments scheduled. Book your first one now and experience our premium barber services."
    : "You don't have any appointments yet. When customers book appointments, they'll appear here.";

  return (
    <Empty
      className={cn(
        "border-2 border-dashed border-primary/20 bg-muted/20 rounded-lg",
        className
      )}
    >
      <EmptyMedia>
        {hasFilters ? (
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <FilterX className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        )}
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle className="text-lg font-semibold">{title || defaultTitle}</EmptyTitle>
        <EmptyDescription className="text-sm text-muted-foreground mt-1">
          {description || defaultDescription}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {hasFilters && (
          <p className="text-xs text-muted-foreground mt-3 px-4 py-2 bg-muted/50 rounded-md border border-border/50">
            Tip: Try clearing your filters to see all appointments.
          </p>
        )}
        {showActionButton && onActionClick && (
          <Button
            size="lg"
            onClick={onActionClick}
            className="mt-4 gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Plus className="h-5 w-5" />
            {actionLabel}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}

