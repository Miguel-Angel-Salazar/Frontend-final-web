"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "../config/env";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  listeners.forEach((listener) => listener());
}

/** Script que corre antes de pintar para evitar el parpadeo del tema. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEYS.theme}");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "light");
  const toggleTheme = () => applyTheme(theme === "dark" ? "light" : "dark");
  return { theme, toggleTheme };
}
