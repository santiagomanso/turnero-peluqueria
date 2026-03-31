"use client";

import { Sun, Moon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAdminTheme } from "./admin-theme-provider";

/**
 * Reusable dropdown menu item for toggling admin theme.
 * Drop this into any DropdownMenuContent across the admin panel.
 */
export function ThemeMenuItem() {
  const { isDark, toggle } = useAdminTheme();

  return (
    <DropdownMenuItem
      onClick={toggle}
      className="flex items-center gap-2 cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
      {isDark ? "Modo claro" : "Modo oscuro"}
    </DropdownMenuItem>
  );
}
