"use client";

import { useState } from "react";
import {
  Settings2,
  RefreshCw,
  CalendarDays,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";
import AdminCreateAppointment from "./admin-create-appointment";
import { useAdminTheme } from "./admin-theme-provider";

export function AppointmentsMobileControls() {
  const vm = useAdminAppointments();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { isDark, toggle } = useAdminTheme();

  const dateLabel = isTodayFromISO(vm.selectedDate)
    ? "Hoy"
    : formatDateFromISO(vm.selectedDate);

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
                className="flex items-center gap-2 cursor-pointer"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {dateLabel}
              </DropdownMenuItem>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
            >
              <Calendar
                mode="single"
                selected={vm.selectedDate}
                onSelect={(date) => {
                  vm.handleDateSelect(date);
                  setCalendarOpen(false);
                  setDropdownOpen(false);
                }}
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
    </>
  );
}
