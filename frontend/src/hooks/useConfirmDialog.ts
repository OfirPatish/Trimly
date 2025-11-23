import { useState, useCallback } from "react";

interface UseConfirmDialogOptions<T = string> {
  onConfirm: (item: T) => Promise<void> | void;
}

export function useConfirmDialog<T = string>({
  onConfirm,
}: UseConfirmDialogOptions<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = useCallback((itemToConfirm: T) => {
    setItem(itemToConfirm);
    setIsOpen(true);
    setError(null);
  }, []);

  const handleClose = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setItem(null);
      setError(null);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!item) return;

    setError(null);

    try {
      await onConfirm(item);
      setIsOpen(false);
      setItem(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    }
  }, [item, onConfirm]);

  return {
    isOpen,
    item,
    error,
    handleOpen,
    handleClose,
    handleConfirm,
  };
}
