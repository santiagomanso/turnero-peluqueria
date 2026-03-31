"use client";

import { Settings2, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePeriod } from "@/app/admin/_hooks/use-period";
import { useMetricsStore } from "../_hooks/use-metrics-store";
import { ThemeMenuItem } from "@/app/admin/_components/theme-menu-item";

const PERIODS = [
  { id: "week" as const, label: "Semana" },
  { id: "month" as const, label: "Mes" },
  { id: "year" as const, label: "Año" },
];

/**
 * Dropdown menu shown in the mobile topbar for the Metrics page.
 * Contains: period selector, refresh, theme toggle.
 */
export function MetricsMobileDropdown() {
  const { period, setPeriod } = usePeriod();
  const { isLoading, refresh } = useMetricsStore();

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
        {PERIODS.map(({ id, label }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setPeriod(id)}
            className="flex items-center justify-between cursor-pointer"
          >
            {label}
            {period === id && <Check className="w-3.5 h-3.5 text-gold" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="dark:bg-zinc-800" />
        <DropdownMenuItem
          onClick={() => refresh(period)}
          disabled={isLoading}
          className="flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:bg-zinc-800" />
        <ThemeMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
