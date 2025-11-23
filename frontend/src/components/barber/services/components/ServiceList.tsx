"use client";

import { Spinner } from "@/components/ui/spinner";
import { Scissors } from "lucide-react";
import type { Service } from "@/hooks/queries/useServices";
import { ServiceCard } from "./ServiceCard";

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onToggle: (serviceId: string, isActive: boolean) => void;
  isToggling?: boolean;
}

export function ServiceList({
  services,
  isLoading,
  onEdit,
  onToggle,
  isToggling = false,
}: ServiceListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  // Separate active and inactive services
  const activeServices = services.filter(
    (service) => service.isActive !== false
  );
  const inactiveServices = services.filter(
    (service) => service.isActive === false
  );

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mx-auto mb-4">
          <Scissors className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No services found</h3>
        <p className="text-sm text-muted-foreground">
          Create your first service to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Services */}
      {activeServices.length > 0 && (
        <div className="space-y-4">
          {activeServices.length > 0 && inactiveServices.length > 0 && (
            <h4 className="text-sm font-semibold text-foreground">
              Active Services
            </h4>
          )}
          {activeServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={onEdit}
              onToggle={onToggle}
              isToggling={isToggling}
            />
          ))}
        </div>
      )}

      {/* Inactive Services */}
      {inactiveServices.length > 0 && (
        <div className="space-y-4">
          {activeServices.length > 0 && (
            <h4 className="text-sm font-semibold text-muted-foreground">
              Inactive Services
            </h4>
          )}
          {inactiveServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={onEdit}
              onToggle={onToggle}
              isToggling={isToggling}
            />
          ))}
        </div>
      )}
    </div>
  );
}

