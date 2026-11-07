import Link from "next/link";
import { cn } from "../utils/format";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)} aria-label="Respawn, ir al inicio">
      <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-sun font-display text-lg font-extrabold text-[#17142b] -rotate-12 transition-transform group-hover:rotate-[350deg] duration-500">
        R
      </span>
      <span className={cn("font-display text-xl font-extrabold tracking-tight", inverted ? "text-paper" : "text-ink")}>
        respawn<span className="text-coral">.</span>
      </span>
    </Link>
  );
}
