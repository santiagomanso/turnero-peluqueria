"use client";

import { useState, useEffect } from "react";
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
import { CalendarDayButton } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";
import AdminCreateAppointment from "./admin-create-appointment";
import { useAdminTheme } from "./admin-theme-provider";
import type { DayButton } from "react-day-picker";
import { cn } from "@/lib/utils";

function getDayColor(count: number): string | undefined {
  if (count === 0) return undefined;
  if (count <= 4) return "bg-green-500/20 !text-green-700 dark:!text-green-400";
  if (count <= 10)
    return "bg-amber-500/20 !text-amber-700 dark:!text-amber-400";
  return "bg-red-500/20 !text-red-700 dark:!text-red-400";
}

export function AppointmentsMobileControls() {
  const vm = useAdminAppointments();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(vm.selectedDate);

  const { isDark, toggle } = useAdminTheme();

  const dateLabel = isTodayFromISO(vm.selectedDate)
    ? "Hoy"
    : formatDateFromISO(vm.selectedDate);

  useEffect(() => {
    if (calendarOpen) {
      vm.fetchMonthlyCounts(
        displayMonth.getFullYear(),
        displayMonth.getMonth(),
      );
    }
  }, [calendarOpen, displayMonth]);

  const ColoredDayButton = (props: React.ComponentProps<typeof DayButton>) => {
    const dateKey = props.day.date.toISOString().split("T")[0];
    const count = vm.monthlyCounts[dateKey] ?? 0;
    const colorClass = getDayColor(count);

    return (
      <CalendarDayButton
        {...props}
        selectedStyle="outline"
        className={cn(colorClass, props.className)}
      />
    );
  };

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
                month={displayMonth}
                onMonthChange={(month) => setDisplayMonth(month)}
                locale={es}
                initialFocus
                style={{ "--cell-size": "2.75rem" } as React.CSSProperties}
                className="p-4"
                components={{ DayButton: ColoredDayButton }}
              />
              <div className="flex items-center justify-center gap-4 px-4 pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/40" />
                  <span className="text-[10px] text-content-tertiary dark:text-zinc-500">
                    1–4 turnos
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/40" />
                  <span className="text-[10px] text-content-tertiary dark:text-zinc-500">
                    5–10 turnos
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/40" />
                  <span className="text-[10px] text-content-tertiary dark:text-zinc-500">
                    11+ turnos
                  </span>
                </div>
              </div>
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
