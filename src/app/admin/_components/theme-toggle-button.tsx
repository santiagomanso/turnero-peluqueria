"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "./admin-theme-provider";

/**
 * Icon-only button for toggling admin theme.
 * Used in desktop headers across the admin panel.
 */
export function ThemeToggleButton() {
  const { isDark, toggle } = useAdminTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className="h-9 w-9 shadow-sm"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
