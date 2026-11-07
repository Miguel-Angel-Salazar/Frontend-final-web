import { STORAGE_KEYS } from "../config/env";
import type { User } from "@/features/auth/domain/user";

export interface Session {
  token: string;
  user: User;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedSession: Session | null | undefined;

function readFromStorage(): Session | null {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const rawUser = localStorage.getItem(STORAGE_KEYS.user);
  if (!token || !rawUser) {
    return null;
  }
  try {
    return { token, user: JSON.parse(rawUser) as User };
  } catch {
    return null;
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

/** Sesión actual en el navegador (token + usuario) guardada en localStorage. */
export const sessionStore = {
  getSnapshot(): Session | null {
    if (cachedSession === undefined) {
      cachedSession = readFromStorage();
    }
    return cachedSession;
  },

  /** En el servidor no hay sesión conocida: `undefined` significa "aún cargando". */
  getServerSnapshot(): Session | null | undefined {
    return undefined;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.token || event.key === STORAGE_KEYS.user) {
        cachedSession = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return sessionStore.getSnapshot()?.token ?? null;
  },

  save(session: Session): void {
    localStorage.setItem(STORAGE_KEYS.token, session.token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
    cachedSession = session;
    notify();
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    cachedSession = null;
    notify();
  },
};
