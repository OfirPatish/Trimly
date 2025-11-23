"use client";

import { useMemo, useEffect, memo } from "react";
import { isSameDay } from "date-fns";
import type { BarberSchedule } from "@/types";
import { useScheduleStore } from "@/stores";
import {
  ALL_TIME_SLOTS,
  timeToMinutes,
  getCurrentTimeMinutes,
  getNextSlotMinutes,
} from "../utils";
import { ScheduleView } from "./ScheduleView";
import { TimeSelectors } from "./TimeSelectors";
import { ScheduleFormActions } from "./ScheduleFormActions";
import { ScheduleLoading } from "./ScheduleLoading";

interface ScheduleFormProps {
  existingSchedule: BarberSchedule | null;
  isLoading: boolean;
  onSave: (data: {
    startTime: string;
    endTime: string;
    isActive: boolean;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const ScheduleForm = memo(function ScheduleForm({
  existingSchedule,
  isLoading,
  onSave,
  onCancel,
  onDelete,
}: ScheduleFormProps) {
  // Get values from store
  const selectedDate = useScheduleStore((state) => state.selectedDate);
  const isEditing = useScheduleStore((state) => state.isEditing);
  const setIsEditing = useScheduleStore((state) => state.setIsEditing);

  // Auto-enter edit mode if no schedule exists, stay in view mode if schedule exists
  useEffect(() => {
    if (selectedDate && !isLoading) {
      if (existingSchedule) {
        // Schedule exists, ensure we're in view mode
        setIsEditing(false);
      } else {
        // No schedule exists, auto-enter edit mode
        setIsEditing(true);
      }
    }
  }, [existingSchedule, selectedDate, isLoading, setIsEditing]);

  // Check if the selected date is today
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    return isSameDay(selectedDate, new Date());
  }, [selectedDate]);

  // Filter out past times if the date is today
  const availableTimeSlots = useMemo(() => {
    if (isToday && isEditing) {
      const currentTimeMinutes = getCurrentTimeMinutes();
      const nextSlotMinutes = getNextSlotMinutes(currentTimeMinutes);
      return ALL_TIME_SLOTS.filter((slot) => {
        return timeToMinutes(slot) >= nextSlotMinutes;
      });
    }
    return ALL_TIME_SLOTS;
  }, [isToday, isEditing]);

  // Use store for form state - components subscribe only to what they need
  const startTime = useScheduleStore((state) => state.startTime);
  const endTime = useScheduleStore((state) => state.endTime);
  const initializeForm = useScheduleStore((state) => state.initializeForm);

  // Initialize form when existingSchedule changes (but only when not editing)
  useEffect(() => {
    if (!isEditing) {
      initializeForm(
        existingSchedule?.startTime || "",
        existingSchedule?.endTime || ""
      );
    }
  }, [
    existingSchedule?.startTime,
    existingSchedule?.endTime,
    isEditing,
    initializeForm,
  ]);

  const handleSave = () => {
    if (!startTime || !endTime) {
      return;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return;
    }

    // Validate that start time is not in the past if it's today
    if (isToday) {
      const currentTimeMinutes = getCurrentTimeMinutes();
      if (startMinutes < currentTimeMinutes) {
        return;
      }
    }

    onSave({
      startTime,
      endTime,
      isActive: true,
    });
  };

  if (isLoading) {
    return <ScheduleLoading />;
  }

  // Show view mode if schedule exists and not editing
  if (!isEditing && existingSchedule) {
    return <ScheduleView schedule={existingSchedule} onDelete={onDelete} />;
  }

  return (
    <div className="space-y-4">
      <TimeSelectors
        availableTimeSlots={availableTimeSlots}
        isToday={isToday}
      />
      <ScheduleFormActions
        availableTimeSlots={availableTimeSlots}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
});
