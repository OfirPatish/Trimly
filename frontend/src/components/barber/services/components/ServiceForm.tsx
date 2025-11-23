"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceTypeSelect } from "./ServiceTypeSelect";
import { X } from "lucide-react";

interface ServiceFormProps {
  formData: {
    serviceType: string;
    serviceId: string;
    name: string;
    price: string;
    duration: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function ServiceForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
}: ServiceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="serviceType" className="text-sm font-medium">
            Service Type
          </Label>
          <ServiceTypeSelect
            value={formData.serviceType}
            onChange={(value) =>
              setFormData({ ...formData, serviceType: value })
            }
            disabled={isEditing}
          />
        </div>

        {formData.serviceType === "custom" && (
          <div className="space-y-2.5">
            <Label htmlFor="serviceId" className="text-sm font-medium">
              Service ID
            </Label>
            <Input
              id="serviceId"
              value={formData.serviceId}
              onChange={(e) =>
                setFormData({ ...formData, serviceId: e.target.value })
              }
              placeholder="custom-service-id"
              disabled={isEditing}
              className="font-mono text-sm"
            />
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="name" className="text-sm font-medium">
          Service Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter service name"
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="price" className="text-sm font-medium">
            Price ($)
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="duration" className="text-sm font-medium">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="20"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-border/50">
        <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" className="gap-2">
          {isEditing ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}

