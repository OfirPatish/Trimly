"use client";

import type { Appointment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";
import { getStatusVariant } from "@/utils/appointments";
import { formatPrice } from "@/utils/price";
import { Calendar, Clock, Phone, Mail, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemCard, BaseCardContent } from "@/components/shared/cards";

interface BarberAppointmentCardProps {
  appointment: Appointment;
  isPast?: boolean;
  showTimeBadge?: boolean;
  onCancel?: (id: string) => void;
  className?: string;
}

export function BarberAppointmentCard({
  appointment,
  isPast = false,
  showTimeBadge = false,
  onCancel,
  className,
}: BarberAppointmentCardProps) {
  const { date: barberDate, time: barberTime } = formatDate(
    appointment.appointmentDate
  );

  const getTimeStatus = () => {
    if (!showTimeBadge) return null;
    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    const diffMinutes = Math.floor((aptDate.getTime() - now.getTime()) / 60000);
    if (diffMinutes < 0) return "past";
    if (diffMinutes < 30) return "soon";
    return "upcoming";
  };

  const timeStatus = getTimeStatus();
  const isSoon = timeStatus === "soon";
  const isPastByTime = timeStatus === "past";

  // Leading element: Time badge (if showTimeBadge is true)
  const leadingElement = showTimeBadge ? (
    <div className="flex flex-col items-center min-w-[60px] shrink-0 pt-1">
      <div
        className={cn(
          "text-lg font-bold",
          isPastByTime
            ? "text-muted-foreground"
            : isSoon
            ? "text-orange-600"
            : "text-primary"
        )}
      >
        {barberTime}
      </div>
      {(isSoon || isPastByTime) && (
        <Badge
          variant="outline"
          className={cn(
            "mt-1 text-xs",
            isSoon && "border-orange-500/50 text-orange-600"
          )}
        >
          {isSoon ? "Soon" : "Past"}
        </Badge>
      )}
    </div>
  ) : undefined;

  // Left content: Main appointment information
  const leftContent = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {appointment.user?.name || "Unknown Customer"}
        </h3>
        {appointment.status === "cancelled" && (
          <Badge
            variant={getStatusVariant(appointment.status)}
            className="text-xs font-medium"
          >
            Cancelled
          </Badge>
        )}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground">
        {appointment.serviceType ||
          appointment.service?.name ||
          "General Service"}
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
        {!showTimeBadge && (
          <>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              <span>{barberDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              <span className="font-medium text-foreground">{barberTime}</span>
            </div>
          </>
        )}
        {appointment.user?.phone && (
          <a
            href={`tel:${appointment.user.phone}`}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
            <span className="break-all">{appointment.user.phone}</span>
          </a>
        )}
        {appointment.user?.email && (
          <a
            href={`mailto:${appointment.user.email}`}
            className="flex items-center gap-1 hover:text-primary transition-colors truncate max-w-full sm:max-w-[200px]"
          >
            <Mail className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
            <span className="truncate">{appointment.user.email}</span>
          </a>
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
    !(isPast || isPastByTime) &&
    appointment.status !== "cancelled" &&
    onCancel ? (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onCancel(appointment.id)}
        className="gap-1.5 w-full sm:w-auto"
      >
        <XCircle className="h-4 w-4" />
        Cancel
      </Button>
    ) : undefined;

  return (
    <ItemCard
      className={cn(
        (isPast || isPastByTime) && "opacity-60",
        isSoon && "border-2 border-orange-500/50 bg-orange-500/5",
        className
      )}
    >
      <BaseCardContent
        leadingElement={leadingElement}
        leftContent={leftContent}
        rightContent={rightContent}
        footerContent={footerContent}
      />
    </ItemCard>
  );
}
