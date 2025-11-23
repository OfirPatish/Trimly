"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string | React.ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shrink-0">
          <Icon className={cn("h-7 w-7 text-primary", iconClassName)} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-1">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

