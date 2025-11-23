"use client";

import type { BarberSchedule } from "@/types";
import { useScheduleStore } from "@/stores";
import { ScheduleCard } from "./ScheduleCard";

interface ScheduleViewProps {
  schedule: BarberSchedule;
  onDelete?: () => void;
}

export function ScheduleView({ schedule, onDelete }: ScheduleViewProps) {
  const setIsEditing = useScheduleStore((state) => state.setIsEditing);

  return (
    <ScheduleCard
      schedule={schedule}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
}

