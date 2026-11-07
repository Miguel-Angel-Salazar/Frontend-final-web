"use client";

import { useSyncExternalStore } from "react";
import { sessionStore } from "@/features/common/session/sessionStore";
import { authService } from "../services/authService";

export function useAuth() {
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, sessionStore.getServerSnapshot);

  return {
    user: session?.user ?? null,
    /** false mientras se lee la sesión guardada (primer render en el servidor). */
    isReady: session !== undefined,
    isAuthenticated: Boolean(session),
    isAdmin: session?.user.role === "ADMIN",
    login: authService.login,
    register: authService.register,
    logout: authService.logout,
  };
}
