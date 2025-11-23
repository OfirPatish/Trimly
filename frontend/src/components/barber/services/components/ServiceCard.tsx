"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Edit, Clock } from "lucide-react";
import type { Service } from "@/hooks/queries/useServices";
import { formatPrice } from "@/utils/price";
import { ItemCard, BaseCardContent } from "@/components/shared/cards";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onToggle: (serviceId: string, isActive: boolean) => void;
  isToggling?: boolean;
  className?: string;
}

export function ServiceCard({
  service,
  onEdit,
  onToggle,
  isToggling = false,
  className,
}: ServiceCardProps) {
  const isInactive = service.isActive === false;
  const isActive = service.isActive !== false;

  // Left content: Service information
  const leftContent = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h3
          className={`text-sm sm:text-base font-semibold ${
            isInactive ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {service.name}
        </h3>
        <Badge variant="secondary" className="text-xs font-medium">
          {service.duration} min
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>{service.duration} minutes</span>
        </div>
        <div className="text-xs text-muted-foreground">
          ID: <span className="font-mono">{service.id}</span>
        </div>
      </div>
    </>
  );

  // Right content: Price only
  const rightContent = service.price ? (
    <div className="text-right">
      <div className="text-lg sm:text-xl font-bold text-primary">
        ${formatPrice(service.price)}
      </div>
    </div>
  ) : undefined;

  // Footer content: Action buttons and toggle
  const footerContent = (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`service-toggle-${service.id}`}
          checked={isActive}
          onCheckedChange={(checked) => onToggle(service.id, checked === true)}
          disabled={isToggling}
        />
        <Label
          htmlFor={`service-toggle-${service.id}`}
          className="text-sm font-medium cursor-pointer select-none"
        >
          {isActive ? "Active" : "Inactive"}
        </Label>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(service)}
        className="gap-1.5 w-full sm:w-auto"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </>
  );

  return (
    <ItemCard
      className={`${className || ""} ${isInactive ? "opacity-75" : ""}`}
    >
      <BaseCardContent
        leftContent={leftContent}
        rightContent={rightContent}
        footerContent={footerContent}
      />
    </ItemCard>
  );
}
