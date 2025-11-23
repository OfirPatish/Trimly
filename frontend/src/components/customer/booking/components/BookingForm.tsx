"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  useCreateAppointment,
  useAppointments,
} from "@/components/customer/appointments/hooks";
import { useBarbers } from "@/hooks/queries/useBarbers";
import { useServices } from "@/hooks/queries/useServices";
import { useAvailability } from "@/hooks/queries/useAvailability";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, AlertCircle, CalendarIcon } from "lucide-react";
import { mergeServicesWithUI } from "@/constants/booking";
import {
  formatTimeSlot,
  timeToMinutes,
  getCurrentTimeMinutes,
  isSlotOverlapping,
  isSameDate,
  getStartOfDay,
  parseTimeSlot,
  formatDateToTimeString,
  formatDateToString,
} from "@/utils/time";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookingFormProps {
  onBookingComplete?: () => void;
  onCancel?: () => void;
}

export function BookingForm({ onBookingComplete, onCancel }: BookingFormProps) {
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const createAppointmentMutation = useCreateAppointment();
  const { data: barbers = [], isLoading: loadingBarbers } = useBarbers();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: existingAppointments = [] } = useAppointments();
  const serviceOptions = mergeServicesWithUI(services);
  const dateStr = selectedDate ? formatDateToString(selectedDate) : null;
  const { data: availability, isLoading: loadingAvailability } =
    useAvailability(dateStr, barberId || null, serviceId || null);

  const selectedService = serviceOptions.find((s) => s.id === serviceId);

  // Filter out slots where customer already has an overlapping appointment
  // Also filter out past time slots for same-day bookings
  const availableSlots = useMemo(() => {
    const baseSlots = availability?.availableSlots || [];

    if (!selectedDate || !dateStr || !serviceId) {
      return baseSlots;
    }

    // Get the service duration
    const service = serviceOptions.find((s) => s.id === serviceId);
    if (!service) {
      return baseSlots;
    }

    const newAppointmentDuration = service.duration;

    // Check if selected date is today
    const today = getStartOfDay(new Date());
    const selectedDateOnly = getStartOfDay(selectedDate);
    const isToday = isSameDate(selectedDateOnly, today);

    // Get current time in minutes for filtering past slots on same day
    const currentMinutes = getCurrentTimeMinutes();

    // Get customer's existing appointments on the same date (excluding cancelled)
    const conflictingAppointments = existingAppointments.filter((apt) => {
      if (apt.status === "cancelled") return false;

      const aptDate = new Date(apt.appointmentDate);
      const aptDateOnly = getStartOfDay(aptDate);

      // Check if same date
      return isSameDate(aptDateOnly, selectedDateOnly);
    });

    // Filter out slots that overlap with existing appointments and past times for same day
    return baseSlots.filter((slot) => {
      // Filter out past time slots for same-day bookings
      if (isToday) {
        const slotMinutes = timeToMinutes(slot);
        if (slotMinutes < currentMinutes) {
          return false;
        }
      }

      // Filter out slots that overlap with existing appointments
      return !conflictingAppointments.some((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        const aptStartTime = formatDateToTimeString(aptDate);

        // Get duration from appointment (prefer apt.duration, fallback to service.duration)
        const aptDuration = apt.duration || apt.service?.duration || 0;

        // Check if this slot overlaps with the appointment
        return isSlotOverlapping(
          slot,
          newAppointmentDuration,
          aptStartTime,
          aptDuration
        );
      });
    });
  }, [
    availability?.availableSlots,
    selectedDate,
    dateStr,
    existingAppointments,
    serviceId,
    serviceOptions,
  ]);

  const today = getStartOfDay(new Date());
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!barberId || !serviceId || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields");
      return;
    }

    const { hours, minutes } = parseTimeSlot(selectedTime);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    if (!selectedService) {
      setError("Please select a service");
      return;
    }

    const newAppointmentDuration = selectedService.duration;

    // Check if customer already has an overlapping appointment
    const hasConflict = existingAppointments.some((apt) => {
      if (apt.status === "cancelled") return false;

      const aptDate = new Date(apt.appointmentDate);
      const selectedDateOnly = getStartOfDay(selectedDate);

      // Check if same date
      if (!isSameDate(getStartOfDay(aptDate), selectedDateOnly)) return false;

      // Get appointment start time and duration
      const aptStartTime = formatDateToTimeString(aptDate);
      const aptDuration = apt.duration || apt.service?.duration || 0;

      // Check if appointments overlap
      return isSlotOverlapping(
        selectedTime,
        newAppointmentDuration,
        aptStartTime,
        aptDuration
      );
    });

    if (hasConflict) {
      setError(
        "You already have an appointment that overlaps with this time slot. Please select a different time."
      );
      return;
    }

    createAppointmentMutation.mutate(
      {
        appointmentDate: appointmentDateTime.toISOString(),
        barberId,
        serviceId,
        price: selectedService?.price,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setBarberId("");
          setServiceId("");
          setSelectedDate(null);
          setSelectedTime("");
          setNotes("");
          setError("");
          onBookingComplete?.();
        },
        onError: (err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Failed to create appointment"
          );
        },
      }
    );
  };

  const isPending = createAppointmentMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Barber */}
        <div className="space-y-2">
          <Label htmlFor="barber">Barber *</Label>
          {loadingBarbers ? (
            <div className="h-10 flex items-center justify-center border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Select
              value={barberId}
              onValueChange={(value) => {
                setBarberId(value);
                setSelectedTime("");
              }}
            >
              <SelectTrigger id="barber">
                <SelectValue placeholder="Select a barber" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Service */}
        <div className="space-y-2">
          <Label htmlFor="service">Service *</Label>
          {loadingServices ? (
            <div className="h-10 flex items-center justify-center border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Select
              value={serviceId}
              onValueChange={(value) => {
                setServiceId(value);
                setSelectedTime("");
              }}
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.label} - ${service.price} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <Label>Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => {
                  setSelectedDate(date || null);
                  setSelectedTime("");
                }}
                disabled={(date) => date < today || date > maxDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label>Time *</Label>
          {!barberId || !serviceId || !selectedDate ? (
            <div className="h-10 flex items-center justify-center text-sm text-muted-foreground border rounded-md">
              Select date first
            </div>
          ) : loadingAvailability ? (
            <div className="h-10 flex items-center justify-center border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="h-10 flex items-center justify-center text-sm text-muted-foreground border rounded-md">
              No times available
            </div>
          ) : (
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {formatTimeSlot(slot)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests..."
          maxLength={500}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="ml-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Book Appointment"
          )}
        </Button>
      </div>
    </form>
  );
}
