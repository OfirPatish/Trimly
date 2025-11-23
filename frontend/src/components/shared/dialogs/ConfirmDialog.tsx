"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
  error?: string | null;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  error = null,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-4 pb-2">
          {/* Icon Section */}
          <div className="flex justify-center sm:justify-start">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                isDestructive
                  ? "bg-destructive/10 dark:bg-destructive/20"
                  : "bg-primary/10 dark:bg-primary/20"
              )}
            >
              <AlertTriangle
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDestructive ? "text-destructive" : "text-primary"
                )}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2 text-center sm:text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <DialogFooter className="gap-3 sm:gap-2 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            variant={isDestructive ? "destructive" : "default"}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

