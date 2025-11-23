"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string | ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  headerAction?: ReactNode; // For buttons or actions in header
}

export function SectionCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  headerAction,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={headerClassName}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && (
                <CardDescription>
                  {typeof description === "string" ? description : description}
                </CardDescription>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
