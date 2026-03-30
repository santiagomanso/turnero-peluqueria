"use client";

import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/public-theme-provider";
import { cn } from "@/lib/utils";

type ThemeMode = "system" | "light" | "dark";

const OPTIONS: { value: ThemeMode; icon: React.ElementType; label: string }[] = [
  { value: "system", icon: Monitor, label: "Sistema" },
  { value: "light",  icon: Sun,     label: "Claro" },
  { value: "dark",   icon: Moon,    label: "Oscuro" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg p-0.5 bg-black/5 dark:bg-white/8",
        className
      )}
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md transition-all",
            theme === value
              ? "bg-white dark:bg-zinc-800 text-gold shadow-sm"
              : "text-content-secondary dark:text-zinc-300 hover:text-content dark:hover:text-zinc-100"
          )}
        >
          <Icon size={13} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}
