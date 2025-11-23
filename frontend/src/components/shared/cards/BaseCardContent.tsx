"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseCardContentProps {
  className?: string;
  // Left side content (main content area)
  leftContent: ReactNode;
  // Right side content (price, metadata, etc.) - NOT actions
  rightContent?: ReactNode;
  // Optional leading element (like time badge, icon, etc.)
  leadingElement?: ReactNode;
  // Footer content (action buttons, etc.)
  footerContent?: ReactNode;
  // Mobile layout: stack or keep side-by-side
  mobileStack?: boolean;
}

/**
 * BaseCardContent provides a consistent layout structure for all cards.
 * It ensures:
 * - Consistent spacing and typography
 * - Mobile-responsive layout (stacks on mobile by default)
 * - Proper alignment of content and actions
 * - Actions are separated in a footer section
 */
export function BaseCardContent({
  leftContent,
  rightContent,
  leadingElement,
  footerContent,
  mobileStack = true,
  className,
}: BaseCardContentProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Main content area */}
      <div
        className={cn(
          "flex items-start gap-3",
          mobileStack && "flex-col sm:flex-row",
          !mobileStack && "flex-row"
        )}
      >
        {/* Leading element (e.g., time badge, icon) */}
        {leadingElement && <div className="shrink-0">{leadingElement}</div>}

        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-1.5">{leftContent}</div>

        {/* Right side: price, metadata, etc. */}
        {rightContent && (
          <div
            className={cn(
              "flex flex-col items-end gap-1 shrink-0",
              mobileStack && "w-full sm:w-auto sm:items-end",
              !mobileStack && "items-end"
            )}
          >
            {rightContent}
          </div>
        )}
      </div>

      {/* Footer: Action buttons separated from content */}
      {footerContent && (
        <div className="pt-2 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
            {footerContent}
          </div>
        </div>
      )}
    </div>
  );
}
