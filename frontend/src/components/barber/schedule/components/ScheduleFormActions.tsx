"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Save, X } from "lucide-react";
import { formatTime, timeToMinutes } from "../utils";
import { useScheduleStore } from "@/stores";

interface ScheduleFormActionsProps {
  availableTimeSlots: string[];
  onSave: () => void;
  onCancel: () => void;
}

export function ScheduleFormActions({
  availableTimeSlots,
  onSave,
  onCancel,
}: ScheduleFormActionsProps) {
  const startTime = useScheduleStore((state) => state.startTime);
  const endTime = useScheduleStore((state) => state.endTime);

  const availableEndTimes = useMemo(() => {
    if (!startTime) {
      return availableTimeSlots;
    }
    const startMinutes = timeToMinutes(startTime);
    return availableTimeSlots.filter((slot) => {
      return timeToMinutes(slot) > startMinutes;
    });
  }, [startTime, availableTimeSlots]);

  const isValid = startTime && endTime && availableEndTimes.includes(endTime);

  return (
    <>
      {isValid && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 font-medium">
            Working hours: {formatTime(startTime)} - {formatTime(endTime)}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          onClick={onSave}
          disabled={!isValid}
          className="flex-1 w-full sm:w-auto gap-1.5"
        >
          <Save className="h-4 w-4" />
          Save Schedule
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full sm:w-auto gap-1.5"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </>
  );
}

