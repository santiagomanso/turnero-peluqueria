"use client";

import { useState, useEffect } from "react";
import { es } from "date-fns/locale";
import { CalendarDays, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";
import AdminCreateAppointment from "./admin-create-appointment";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DayButton } from "react-day-picker";
import { CalendarDayButton } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function getDayColor(count: number): string | undefined {
  if (count === 0) return undefined;
  if (count <= 4) return "bg-green-500/20 !text-green-700 dark:!text-green-400";
  if (count <= 10)
    return "bg-amber-500/20 !text-amber-700 dark:!text-amber-400";
  return "bg-red-500/20 !text-red-700 dark:!text-red-400";
}

export function AppointmentControls() {
  const vm = useAdminAppointments();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(vm.selectedDate);

  const dateLabel = isTodayFromISO(vm.selectedDate)
    ? "Hoy"
    : formatDateFromISO(vm.selectedDate);

  useEffect(() => {
    if (isCalendarOpen) {
      vm.fetchMonthlyCounts(
        displayMonth.getFullYear(),
        displayMonth.getMonth(),
      );
    }
  }, [isCalendarOpen, displayMonth]);

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
    <div className="ml-auto flex items-center gap-2">
      <AdminCreateAppointment open={createOpen} onOpenChange={setCreateOpen} />

      <Button
        variant="outline"
        size="icon"
        onClick={() => setCreateOpen(true)}
        className="h-9 w-9 shadow-sm text-content dark:text-zinc-300 hover:text-content dark:hover:text-zinc-100"
      >
        <span className="text-lg leading-none">+</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={vm.handleRefresh}
        disabled={vm.isLoading}
        className="h-9 w-9 shadow-sm text-content dark:text-zinc-300 hover:text-content dark:hover:text-zinc-100"
      >
        <RefreshCw
          className={`w-4 h-4 ${vm.isLoading ? "animate-spin" : ""}`}
        />
      </Button>

      <ThemeToggle />

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 px-3 gap-2 text-sm font-semibold shadow-sm"
          >
            <CalendarDays className="w-4 h-4 text-gold" />
            {dateLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
          align="end"
        >
          <Calendar
            mode="single"
            selected={vm.selectedDate}
            onSelect={(date) => {
              vm.handleDateSelect(date);
              setIsCalendarOpen(false);
            }}
            month={displayMonth}
            onMonthChange={(month) => setDisplayMonth(month)}
            locale={es}
            initialFocus
            style={{ "--cell-size": "3.5rem" } as React.CSSProperties}
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
    </div>
  );
}
