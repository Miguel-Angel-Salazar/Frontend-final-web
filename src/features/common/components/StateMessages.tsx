"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../utils/format";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Spinner } from "./Spinner";

interface StateBoxProps {
  icon: IconName;
  title: string;
  description?: string;
  tone: "neutral" | "error";
  action?: ReactNode;
}

function StateBox({ icon, title, description, tone, action }: StateBoxProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-14 text-center animate-rise">
      <span
        className={cn(
          "grid size-16 place-items-center rounded-[1.4rem_1.4rem_1.4rem_0.4rem] rotate-[-6deg]",
          tone === "error" ? "bg-coral/15 text-coral" : "bg-lime/50 text-ink",
        )}
      >
        <Icon name={icon} size={28} />
      </span>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-violet">
      <Spinner />
      <p className="text-sm font-medium text-muted">{label}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return <StateBox icon="box" tone="neutral" title={title} description={description} action={action} />;
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StateBox
      icon="alert"
      tone="error"
      title="Algo salió mal"
      description={message}
      action={
        onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )
      }
    />
  );
}

interface InlineAlertProps {
  message: string;
  tone?: "error" | "success";
  durationMs?: number;
  onDismiss?: () => void;
}

function CountdownAlertBody({
  message,
  tone = "error",
  durationMs = 4500,
  onDismiss,
}: InlineAlertProps) {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stepMs = 100;
    const interval = window.setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= stepMs) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - stepMs;
      });
    }, stepMs);

    const timeout = window.setTimeout(() => {
      setDismissed(true);
      onDismiss?.();
    }, durationMs);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [durationMs, onDismiss]);

  if (dismissed || remainingMs <= 0) return null;

  const secondsLeft = Math.max(1, Math.ceil(remainingMs / 1000));
  const progressPercent = Math.max(0, Math.min(100, (remainingMs / durationMs) * 100));

  return (
    <div
      role="alert"
      className={cn(
        "relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium animate-rise",
        tone === "error" ? "bg-coral/12 text-coral" : "bg-lime/40 text-ink",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Icon name={tone === "error" ? "alert" : "sparkle"} size={18} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-ink/10 px-2 py-0.5 font-display text-[11px] font-bold tabular-nums">
            {secondsLeft}s
          </span>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
            className="grid size-6 place-items-center rounded-full hover:bg-ink/10"
            aria-label="Cerrar aviso"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-ink/10">
        <div
          className={cn(
            "h-full transition-[width] duration-100 ease-linear",
            tone === "error" ? "bg-coral" : "bg-ink",
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export function InlineAlert(props: InlineAlertProps) {
  return <CountdownAlertBody key={`${props.tone ?? "error"}:${props.message}`} {...props} />;
}
