"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Clock, Calendar } from "lucide-react";
import type { BarberSchedule } from "@/types";
import { formatTime } from "../utils";
import { format } from "date-fns";
import { formatDateToString, isSameDate } from "@/utils/time";
import { ItemCard, BaseCardContent } from "@/components/shared/cards";

interface ScheduleCardProps {
  schedule: BarberSchedule;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  className,
}: ScheduleCardProps) {
  const scheduleDate = new Date(schedule.date);
  const isToday = isSameDate(scheduleDate, new Date());

  // Leading element: Time badge
  const leadingElement = (
    <div className="flex flex-col items-center min-w-[70px] shrink-0 pt-1">
      <Clock className="h-4 w-4 text-primary mb-0.5" />
      <div className="text-base font-bold text-primary text-center">
        {formatTime(schedule.startTime)}
      </div>
      <div className="text-[10px] text-muted-foreground">to</div>
      <div className="text-base font-bold text-primary text-center">
        {formatTime(schedule.endTime)}
      </div>
    </div>
  );

  // Left content: Schedule information
  const leftContent = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          Working Hours
        </h3>
        {isToday && (
          <Badge variant="secondary" className="text-xs font-medium">
            Today
          </Badge>
        )}
        {!schedule.isActive && (
          <Badge variant="outline" className="text-xs font-medium">
            Inactive
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>{format(scheduleDate, "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </span>
        </div>
      </div>
    </>
  );

  // Footer content: Action buttons
  const footerContent =
    onEdit || onDelete ? (
      <>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-1.5 w-full sm:w-auto"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="gap-1.5 w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </>
    ) : undefined;

  return (
    <ItemCard className={className} hover={!!(onEdit || onDelete)}>
      <BaseCardContent
        leadingElement={leadingElement}
        leftContent={leftContent}
        footerContent={footerContent}
      />
    </ItemCard>
  );
}

