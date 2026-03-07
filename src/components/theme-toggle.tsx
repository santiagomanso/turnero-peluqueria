"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./public-theme-provider";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-base dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-content-secondary dark:text-zinc-400 hover:text-content dark:hover:text-zinc-100 transition-all"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun strokeWidth={1.5} className="h-5 w-5" />
      ) : (
        <Moon strokeWidth={1.5} className="h-5 w-5" />
      )}
    </button>
  );
}
