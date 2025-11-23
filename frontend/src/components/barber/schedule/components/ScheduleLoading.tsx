"use client";

import { Loader2 } from "lucide-react";

export function ScheduleLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
      <p className="text-xs sm:text-sm text-muted-foreground">
        Loading schedule...
      </p>
    </div>
  );
}

