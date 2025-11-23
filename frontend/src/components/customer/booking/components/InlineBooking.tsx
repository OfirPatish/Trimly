"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { BookingForm } from "./BookingForm";

interface InlineBookingProps {
  onBookingComplete?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function InlineBooking({
  onBookingComplete,
  showCloseButton = false,
  onClose,
}: InlineBookingProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Book Appointment</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fill in the details below
          </p>
        </div>
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <BookingForm onBookingComplete={onBookingComplete} onCancel={onClose} />
    </Card>
  );
}

