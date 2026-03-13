"use client";

import { Settings2, Plus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminTheme } from "./admin-theme-provider";

export const SHOP_CREATE_EVENT = "shop:open-create";

export function ShopMobileControls() {
  const { isDark, toggle } = useAdminTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg h-9 w-9">
          <Settings2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 dark:bg-zinc-900 dark:border-zinc-800"
      >
        <DropdownMenuItem
          onClick={() => window.dispatchEvent(new Event(SHOP_CREATE_EVENT))}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-gold" />
          Nuevo producto
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-zinc-800" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
