import { cn } from "@/features/common/utils/format";
import { orderStatusMeta } from "../domain/order";

const toneClasses: Record<string, string> = {
  sun: "bg-sun/35 text-ink border-sun",
  sky: "bg-sky/35 text-ink border-sky",
  lime: "bg-lime/50 text-[#17142b] border-lime",
  coral: "bg-coral/15 text-coral border-coral/40",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const meta = orderStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wider",
        toneClasses[meta.tone] ?? toneClasses.sun,
      )}
    >
      {meta.label}
    </span>
  );
}
