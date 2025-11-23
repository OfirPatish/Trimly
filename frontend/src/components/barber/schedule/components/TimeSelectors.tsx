"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTime, timeToMinutes } from "../utils";
import { useScheduleStore } from "@/stores";

interface TimeSelectorsProps {
  availableTimeSlots: string[];
  isToday: boolean;
}

export function TimeSelectors({
  availableTimeSlots,
  isToday,
}: TimeSelectorsProps) {
  const startTime = useScheduleStore((state) => state.startTime);
  const endTime = useScheduleStore((state) => state.endTime);
  const setStartTime = useScheduleStore((state) => state.setStartTime);
  const setEndTime = useScheduleStore((state) => state.setEndTime);
  const isEditing = useScheduleStore((state) => state.isEditing);

  const availableEndTimes = useMemo(() => {
    if (!startTime) {
      return availableTimeSlots;
    }
    const startMinutes = timeToMinutes(startTime);
    return availableTimeSlots.filter((slot) => {
      return timeToMinutes(slot) > startMinutes;
    });
  }, [startTime, availableTimeSlots]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Select value={startTime || undefined} onValueChange={setStartTime}>
          <SelectTrigger id="startTime">
            <SelectValue placeholder="Select start time" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {formatTime(slot)}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No available times
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {isToday && isEditing && (
          <p className="text-xs text-muted-foreground">
            Past times are not available for today
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Select value={endTime || undefined} onValueChange={setEndTime}>
          <SelectTrigger id="endTime">
            <SelectValue placeholder="Select end time" />
          </SelectTrigger>
          <SelectContent>
            {availableEndTimes.length > 0 ? (
              availableEndTimes.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {formatTime(slot)}
                </SelectItem>
              ))
            ) : startTime ? (
              <SelectItem value="" disabled>
                No available end times
              </SelectItem>
            ) : (
              <SelectItem value="" disabled>
                Select start time first
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

