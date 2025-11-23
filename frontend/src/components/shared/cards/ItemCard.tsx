"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ItemCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function ItemCard({ 
  children, 
  className, 
  hover = true,
  padding = "md"
}: ItemCardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-5 sm:p-6",
  };

  return (
    <Card
      className={cn(
        "border transition-all",
        hover && "hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      <CardContent className={cn(paddingClasses[padding])}>
        {children}
      </CardContent>
    </Card>
  );
}
