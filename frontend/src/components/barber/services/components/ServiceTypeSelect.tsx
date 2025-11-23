"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_UI_METADATA } from "@/constants/booking";

interface ServiceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ServiceTypeSelect({
  value,
  onChange,
  disabled,
}: ServiceTypeSelectProps) {
  const serviceTypes = Object.keys(SERVICE_UI_METADATA);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select service type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="custom">Custom Service</SelectItem>
        {serviceTypes.map((serviceId) => {
          const metadata = SERVICE_UI_METADATA[serviceId];
          return (
            <SelectItem key={serviceId} value={serviceId}>
              {metadata?.label || serviceId}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

