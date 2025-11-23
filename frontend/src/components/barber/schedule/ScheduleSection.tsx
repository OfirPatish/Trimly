"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { SectionCard } from "@/components/shared";
import { ScheduleForm } from "./components";
import {
  useBarberSchedule,
  useCreateBarberSchedule,
  useUpdateBarberSchedule,
  useDeleteBarberSchedule,
} from "@/hooks/queries";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/stores";
import { getStartOfDay, formatDateToString } from "@/utils/time";
import { memo } from "react";

// Separate component that only subscribes to selectedDate - prevents re-renders when form state changes
const DatePickerCard = memo(function DatePickerCard() {
  const selectedDate = useScheduleStore((state) => state.selectedDate);
  const setSelectedDate = useScheduleStore((state) => state.setSelectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-auto py-3",
                  !selectedDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {selectedDate
                    ? format(selectedDate, "EEE, MMM d")
                    : "Pick a date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < getStartOfDay(new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </div>
  );
});

export function ScheduleSection() {
  // Use store for selected date and editing state - selective subscriptions
  const selectedDate = useScheduleStore((state) => state.selectedDate);
  const setIsEditing = useScheduleStore((state) => state.setIsEditing);
  const resetForm = useScheduleStore((state) => state.resetForm);

  const dateString = selectedDate ? formatDateToString(selectedDate) : "";

  const { data: scheduleData, isLoading } = useBarberSchedule(dateString);
  const schedule = scheduleData?.schedule || null;
  const createScheduleMutation = useCreateBarberSchedule();
  const updateScheduleMutation = useUpdateBarberSchedule();
  const deleteScheduleMutation = useDeleteBarberSchedule();

  const deleteDialog = useConfirmDialog({
    onConfirm: async (scheduleId: string) => {
      await deleteScheduleMutation.mutateAsync(scheduleId);
      setIsEditing(false);
    },
  });

  // Reset editing state when schedule loads or date changes
  useEffect(() => {
    if (selectedDate) {
      if (schedule) {
        // Schedule exists, ensure we're in view mode
        setIsEditing(false);
        resetForm();
      } else {
        // No schedule, can stay in edit mode if user wants to create
        // Don't force edit mode here, let ScheduleForm handle it
      }
    }
  }, [schedule, selectedDate, setIsEditing, resetForm]);

  const handleSave = async (data: {
    startTime: string;
    endTime: string;
    isActive: boolean;
  }) => {
    if (!selectedDate) return;

    if (schedule) {
      // Update existing schedule
      await updateScheduleMutation.mutateAsync({
        scheduleId: schedule.id,
        data,
      });
    } else {
      // Create new schedule
      await createScheduleMutation.mutateAsync({
        date: dateString,
        ...data,
      });
    }
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!schedule) return;
    deleteDialog.handleOpen(schedule.id);
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  return (
    <>
      <SectionCard
        title="Schedule"
        description="Set your working hours for each date"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Date Picker Card - Left Sidebar on Desktop */}
          <DatePickerCard />

          {/* Schedule Form Card - Right Side on Desktop */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <ScheduleForm
                    existingSchedule={schedule}
                    isLoading={isLoading}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onDelete={schedule ? handleDelete : undefined}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Select a date to set working hours
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.handleClose}
        onConfirm={deleteDialog.handleConfirm}
        title="Delete Schedule?"
        description={`Are you sure you want to delete the schedule for ${
          selectedDate ? format(selectedDate, "MMMM d, yyyy") : "this date"
        }? Customers won't be able to book appointments for this day.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteScheduleMutation.isPending}
        error={deleteDialog.error}
      />
    </>
  );
}
