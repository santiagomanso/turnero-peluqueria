"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./public-theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className="h-9 w-9 shadow-sm text-content dark:text-white hover:text-content dark:hover:text-zinc-100"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun strokeWidth={1.5} className="h-4 w-4" />
      ) : (
        <Moon strokeWidth={1.5} className="h-4 w-4" />
      )}
    </Button>
  );
}
