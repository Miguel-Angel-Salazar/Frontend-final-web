"use client";

import { useTheme } from "../hooks/useTheme";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-surface-soft hover:rotate-12"
    >
      <Icon name={isDark ? "sun" : "moon"} size={19} />
    </button>
  );
}
