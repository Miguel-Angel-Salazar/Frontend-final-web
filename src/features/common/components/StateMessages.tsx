import type { ReactNode } from "react";
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

export function InlineAlert({ message, tone = "error" }: { message: string; tone?: "error" | "success" }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium",
        tone === "error" ? "bg-coral/12 text-coral" : "bg-lime/40 text-ink",
      )}
    >
      <Icon name={tone === "error" ? "alert" : "sparkle"} size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
