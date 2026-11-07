"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  children,
  confirmLabel = "Confirmar",
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isProcessing) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isProcessing, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-[#17142b]/50 backdrop-blur-sm"
        onClick={() => !isProcessing && onCancel()}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-md rounded-[2rem_2rem_2rem_0.6rem] border-2 border-ink bg-surface p-7 shadow-[8px_8px_0_0_var(--ink)] animate-rise"
      >
        <h2 id="confirm-title" className="font-display text-2xl font-bold">
          {title}
        </h2>
        <div className="mt-3 text-muted">{children}</div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isProcessing}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
