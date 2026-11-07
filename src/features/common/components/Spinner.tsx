import { cn } from "../utils/format";

interface SpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

/** Tres "pixeles" que rebotan, como un cargador de consola retro. */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const dot = size === "sm" ? "size-1.5" : "size-2.5";
  return (
    <span role="status" aria-label="Cargando" className={cn("inline-flex items-end gap-1", className)}>
      <span className={cn(dot, "rounded-[3px] bg-current animate-bounce [animation-delay:-0.3s]")} />
      <span className={cn(dot, "rounded-[3px] bg-current animate-bounce [animation-delay:-0.15s]")} />
      <span className={cn(dot, "rounded-[3px] bg-current animate-bounce")} />
    </span>
  );
}
