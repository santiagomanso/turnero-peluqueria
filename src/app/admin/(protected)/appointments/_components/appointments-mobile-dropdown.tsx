"use client";

import { useState } from "react";
import { Settings2, RefreshCw, Plus, CalendarDays, Eye, EyeOff, LayoutGrid, LayoutList, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAdminAppointments } from "../_hooks/use-appointments";
import { AppointmentCalendarBody } from "./appointment-calendar";
import { ThemeMenuItem } from "@/app/admin/_components/theme-menu-item";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";
import AdminCreateAppointment from "./create-appointment-modal";

/**
 * Dropdown menu shown in the mobile topbar for the Appointments page.
 * Contains: create appointment, refresh, calendar picker, theme toggle.
 */
type ViewMode = "cards-square" | "cards-flat" | "table";

export function AppointmentsMobileDropdown({
  viewMode,
  onViewModeChange,
}: {
  viewMode?: ViewMode;
  onViewModeChange?: (v: ViewMode) => void;
}) {
  const vm = useAdminAppointments();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const isToday = isTodayFromISO(vm.selectedDate);
  const dateLabel = isToday ? "Hoy" : formatDateFromISO(vm.selectedDate);

  return (
    <>
      <AdminCreateAppointment open={createOpen} onOpenChange={setCreateOpen} />

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-lg h-9 w-9">
            <Settings2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 dark:bg-zinc-900 dark:border-zinc-800"
        >
          <DropdownMenuItem
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Crear turno
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-zinc-800" />
          <DropdownMenuItem
            onClick={vm.handleRefresh}
            disabled={vm.isLoading}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${vm.isLoading ? "animate-spin" : ""}`}
            />
            Actualizar
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-zinc-800" />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  !isToday && "text-zinc-900 dark:text-zinc-100",
                )}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {dateLabel}
              </DropdownMenuItem>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
            >
              <AppointmentCalendarBody
                cellSize="2.75rem"
                onAfterSelect={() => {
                  setCalendarOpen(false);
                  setDropdownOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              vm.toggleShowCancelled();
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            {vm.showCancelled ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {vm.showCancelled ? "Ocultar cancelados" : "Mostrar cancelados"}
          </DropdownMenuItem>
          {onViewModeChange && (
            <>
              <DropdownMenuSeparator className="dark:bg-zinc-800" />
              <DropdownMenuLabel className="text-[0.65rem] font-semibold text-content-tertiary dark:text-zinc-500 uppercase tracking-wide px-2 py-1">
                Vista
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={viewMode ?? "cards-square"}
                onValueChange={(v) => onViewModeChange(v as ViewMode)}
              >
                <DropdownMenuRadioItem
                  value="cards-square"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Cuadradas
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="cards-flat"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  Planas
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="table"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <List className="w-3.5 h-3.5" />
                  Tabla
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </>
          )}
          <DropdownMenuSeparator className="dark:bg-zinc-800" />
          <ThemeMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
