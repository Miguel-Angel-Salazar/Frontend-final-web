"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LoadingState } from "@/features/common/components/StateMessages";
import { useAuth } from "../hooks/useAuth";

interface RouteGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

/** Protege páginas privadas o exclusivas de administrador. */
export function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { isReady, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.replace("/");
    }
  }, [isReady, isAuthenticated, isAdmin, requireAdmin, pathname, router]);

  if (!isReady || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return <LoadingState label="Verificando acceso..." />;
  }

  return <>{children}</>;
}

/** Redirige al inicio cuando un usuario con sesión entra a /login o /register. */
export function GuestGuard({ children }: { children: ReactNode }) {
  const { isReady, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/");
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || isAuthenticated) {
    return <LoadingState label="Preparando sesión..." />;
  }

  return <>{children}</>;
}
