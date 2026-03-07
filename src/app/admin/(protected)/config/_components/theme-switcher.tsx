"use client";

import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
] as const;

type Theme = (typeof THEME_OPTIONS)[number]["value"];

interface ThemeSwitcherProps {
  theme: Theme;
  onSelect: (value: Theme) => void;
}

export function ThemeSwitcher({ theme, onSelect }: ThemeSwitcherProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Apariencia
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Elegí el tema visual para tu panel de administración.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {THEME_OPTIONS.map((option) => (
          <div
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-all cursor-pointer",
              theme === option.value
                ? "border-border-subtle dark:border-zinc-700 bg-surface dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-900 text-content dark:text-zinc-100"
                : "border-border-subtle dark:border-zinc-600 bg-white dark:bg-transparent text-content-secondary dark:text-zinc-600 hover:border-gold/20 hover:bg-gold/5",
            )}
          >
            <option.icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
