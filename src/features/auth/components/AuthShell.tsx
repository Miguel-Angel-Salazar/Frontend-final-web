import type { ReactNode } from "react";
import { Icon } from "@/features/common/components/Icon";

interface AuthShellProps {
  badge: string;
  title: string;
  subtitle: string;
  accentTitle: string;
  accentCopy: string;
  children: ReactNode;
}

export function AuthShell({ badge, title, subtitle, accentTitle, accentCopy, children }: AuthShellProps) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="grid items-stretch gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative flex flex-col justify-between overflow-hidden rounded-[2.6rem_0.9rem_2.6rem_2.6rem] border-2 border-ink bg-violet p-8 text-white shadow-[8px_8px_0_0_var(--ink)] sm:p-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <Icon name="gamepad" size={16} />
              {badge}
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{accentTitle}</h1>
            <p className="text-sm text-white/85 sm:text-base">{accentCopy}</p>
          </div>

          <div className="mt-10 rounded-[1.6rem_1.6rem_1.6rem_0.4rem] border-2 border-ink bg-lime p-4 text-[#17142b]">
            <p className="font-display text-xs font-extrabold uppercase tracking-wider">Cuentas de prueba (seed)</p>
            <p className="mt-1 text-xs font-medium">
              Admin: <code className="font-bold">admin@respawn.com</code> · User:{" "}
              <code className="font-bold">user@respawn.com</code>
            </p>
          </div>
        </aside>

        <section className="rounded-[0.9rem_2.6rem_2.6rem_2.6rem] border-2 border-ink bg-surface p-7 shadow-[8px_8px_0_0_var(--ink)] sm:p-10">
          <div className="mb-6 space-y-1.5">
            <h2 className="font-display text-3xl font-extrabold">{title}</h2>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
