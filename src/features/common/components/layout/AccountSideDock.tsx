"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "../../utils/format";
import { Button, ButtonLink } from "../Button";
import { Icon } from "../Icon";

/**
 * Pestaña vertical en el borde izquierdo de la pantalla para gestionar la cuenta y sesión,
 * evitando la típica esquina superior derecha de las plantillas genéricas.
 */
export function AccountSideDock() {
  const { user, isReady, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const isOpen = openOnPath === pathname;
  const closeDock = () => setOpenOnPath(null);
  const toggleDock = () => setOpenOnPath((current) => (current === pathname ? null : pathname));

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOnPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!isReady) return null;

  const handleLogout = () => {
    logout();
    closeDock();
    router.push("/");
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar panel de cuenta"
          onClick={closeDock}
          className="fixed inset-0 z-40 bg-[#17142b]/35 backdrop-blur-[2px]"
        />
      )}

      <aside
        aria-label="Acceso de cuenta"
        className="fixed left-0 top-1/2 z-50 flex -translate-y-1/2 items-center"
      >
        {/* Panel vertical que se despliega desde el borde izquierdo */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "ml-3 w-72 opacity-100" : "w-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="rounded-[0.7rem_2.2rem_2.2rem_0.7rem] border-2 border-ink bg-surface p-6 shadow-[8px_8px_0_0_var(--ink)]">
            {!user ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-xs font-extrabold uppercase tracking-wider text-coral">
                      Pase de jugador
                    </p>
                    <h2 className="font-display text-xl font-extrabold">Tu cuenta</h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeDock}
                    aria-label="Cerrar panel"
                    className="grid size-8 place-items-center rounded-full hover:bg-surface-soft"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-muted">
                  Inicia sesión para hacer pedidos y seguir tus envíos, o regístrate en segundos.
                </p>

                <div className="flex flex-col gap-2.5 pt-1">
                  <ButtonLink href="/login" size="md" className="w-full" onClick={closeDock}>
                    Iniciar sesión
                  </ButtonLink>
                  <ButtonLink href="/register" variant="secondary" size="md" className="w-full" onClick={closeDock}>
                    Crear cuenta
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-violet font-display text-lg font-extrabold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-extrabold">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeDock}
                    aria-label="Cerrar panel"
                    className="grid size-8 place-items-center rounded-full hover:bg-surface-soft"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 border-y-2 border-dashed border-line py-3 text-sm font-semibold">
                  <Link
                    href="/pedidos"
                    onClick={closeDock}
                    className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-surface-soft"
                  >
                    <span>Mis pedidos</span>
                    <Icon name="bag" size={16} />
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={closeDock}
                      className="flex items-center justify-between rounded-xl bg-lime/40 px-3 py-2 text-ink hover:bg-lime"
                    >
                      <span>Panel de administración</span>
                      <Icon name="shield" size={16} />
                    </Link>
                  )}
                </div>

                <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
                  <Icon name="logout" size={16} />
                  Cerrar sesión
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Pestaña vertical pegada a la izquierda */}
        <button
          type="button"
          onClick={toggleDock}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Ocultar acceso de cuenta" : "Desplegar acceso de cuenta"}
          className={cn(
            "group flex flex-col items-center gap-2.5 rounded-r-[1.4rem] border-2 border-l-0 border-ink px-2.5 py-4 shadow-[4px_4px_0_0_var(--ink)] transition hover:pl-3.5",
            user ? "bg-lime text-[#17142b]" : "bg-coral text-white",
          )}
        >
          <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-surface text-ink">
            {user ? (
              <span className="font-display text-xs font-extrabold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Icon name="user" size={15} />
            )}
          </span>
          <span className="font-display text-xs font-extrabold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            {user ? user.name.split(" ")[0] : "Ingresar"}
          </span>
        </button>
      </aside>
    </>
  );
}
