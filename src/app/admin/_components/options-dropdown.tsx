"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeMenuItem } from "./theme-menu-item";

/**
 * Minimal options dropdown with theme toggle.
 * Use on admin pages that don't have page-specific controls.
 */
export function OptionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg h-9 w-9">
          <Settings2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 dark:bg-zinc-900 dark:border-zinc-800"
      >
        <ThemeMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
