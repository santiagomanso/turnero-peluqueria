"use client";

import { useState, type ReactNode } from "react";
import {
  RefreshCw,
  LayoutGrid,
  LayoutList,
  List,
  CalendarDays,
  Eye,
  EyeOff,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAdminAppointments } from "../_hooks/use-appointments";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";
import { AppointmentCalendarBody } from "./appointment-calendar";
import AdminCreateAppointment from "./create-appointment-modal";
import { AppointmentsMobileDropdown } from "./appointments-mobile-dropdown";
import { GlobalSearchInput } from "./global-search-input";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";

type ViewMode = "cards-square" | "cards-flat" | "table";

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_BUTTONS: { mode: ViewMode; icon: ReactNode; label: string }[] = [
  {
    mode: "cards-square",
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
    label: "Cuadradas",
  },
  {
    mode: "cards-flat",
    icon: <LayoutList className="w-3.5 h-3.5" />,
    label: "Planas",
  },
  { mode: "table", icon: <List className="w-3.5 h-3.5" />, label: "Tabla" },
];

export function AppointmentsDesktopToolbar({
  viewMode,
  onViewModeChange,
}: Props) {
  const vm = useAdminAppointments();
  const { isDark, toggle: toggleTheme } = useAdminTheme();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const isToday = isTodayFromISO(vm.selectedDate);
  const dateLabel = isToday ? "Hoy" : formatDateFromISO(vm.selectedDate);

  return (
    <>
      <AdminCreateAppointment open={createOpen} onOpenChange={setCreateOpen} />

      {/* Global search */}
      <GlobalSearchInput className="ml-auto max-w-100 w-full" />

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* Date chip */}
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs font-medium border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
              calendarOpen && "border-gold/40 bg-gold/5",
              !isToday &&
                "bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-600",
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {dateLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
        >
          <AppointmentCalendarBody
            cellSize="2.75rem"
            onAfterSelect={() => setCalendarOpen(false)}
          />
        </PopoverContent>
      </Popover>

      {/* Cancelled toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={vm.toggleShowCancelled}
        className={cn(
          "h-8 gap-1.5 text-xs font-medium border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
          vm.showCancelled &&
            "bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-600",
        )}
      >
        {vm.showCancelled ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
        Cancelados
      </Button>

      {/* View mode buttons — hidden at lg, visible at xl */}
      <div className="hidden xl:block w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />
      <div className="hidden xl:flex items-center gap-1">
        {VIEW_BUTTONS.map(({ mode, icon, label }) => (
          <Button
            key={mode}
            aria-label={label}
            variant="outline"
            size="icon"
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
              viewMode === mode &&
                "bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600",
            )}
          >
            {icon}
          </Button>
        ))}
      </div>

      {/* Theme buttons — hidden at lg, visible at xl */}
      <div className="hidden xl:block w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />
      <div className="hidden xl:flex items-center gap-1">
        <Button
          aria-label="Modo claro"
          variant="outline"
          size="icon"
          onClick={() => isDark && toggleTheme()}
          className={cn(
            "h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
            !isDark && "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100",
          )}
        >
          <Sun className="w-3.5 h-3.5" />
        </Button>
        <Button
          aria-label="Modo oscuro"
          variant="outline"
          size="icon"
          onClick={() => !isDark && toggleTheme()}
          className={cn(
            "h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
            isDark && "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100",
          )}
        >
          <Moon className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Divider before CTA */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* New appointment */}
      <Button
        size="sm"
        onClick={() => setCreateOpen(true)}
        className="h-8 gap-1.5 text-xs font-medium bg-gold text-white hover:bg-gold/90 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
        Nuevo turno
      </Button>

      {/* Refresh — hidden at lg, visible at xl */}
      <Button
        aria-label="Actualizar"
        variant="outline"
        size="icon"
        onClick={vm.handleRefresh}
        disabled={vm.isLoading}
        className="hidden xl:flex h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50"
      >
        <RefreshCw
          className={cn("w-3.5 h-3.5", vm.isLoading && "animate-spin")}
        />
      </Button>

      {/* Settings dropdown */}
      <AppointmentsMobileDropdown
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
    </>
  );
}
