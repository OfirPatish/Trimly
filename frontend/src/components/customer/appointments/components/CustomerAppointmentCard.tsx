"use client";

import type { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAppointmentDate } from "@/utils/date";
import { formatPrice } from "@/utils/price";
import { Calendar, Clock, User, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemCard, BaseCardContent } from "@/components/shared/cards";

interface CustomerAppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
  onDelete?: (id: string) => void;
  className?: string;
}

export function CustomerAppointmentCard({
  appointment,
  isPast = false,
  onDelete,
  className,
}: CustomerAppointmentCardProps) {
  const { date, time } = formatAppointmentDate(appointment.appointmentDate);
  const isCancelled = appointment.status === "cancelled";

  // Left content: Main appointment information
  const leftContent = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {appointment.service?.name || "Haircut"}
        </h3>
        {isCancelled && (
          <Badge variant="secondary" className="text-xs font-medium">
            Cancelled
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span className="font-medium text-foreground">{time}</span>
        </div>
        {appointment.barber && (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
            <span>{appointment.barber.name}</span>
          </div>
        )}
      </div>
      {appointment.notes && (
        <div className="pt-1.5 border-t border-border/50">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {appointment.notes}
          </p>
        </div>
      )}
    </>
  );

  // Right content: Price only
  const rightContent = appointment.price ? (
    <div className="text-right">
      <div className="text-lg sm:text-xl font-bold text-primary">
        ${formatPrice(appointment.price)}
      </div>
    </div>
  ) : undefined;

  // Footer content: Action buttons
  const footerContent =
    !isPast && appointment.status !== "cancelled" && onDelete ? (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(appointment.id)}
        className="gap-1.5 w-full sm:w-auto"
      >
        <XCircle className="h-4 w-4" />
        Cancel
      </Button>
    ) : undefined;

  return (
    <ItemCard className={cn(isCancelled && "opacity-60", className)}>
      <BaseCardContent
        leftContent={leftContent}
        rightContent={rightContent}
        footerContent={footerContent}
      />
    </ItemCard>
  );
}
