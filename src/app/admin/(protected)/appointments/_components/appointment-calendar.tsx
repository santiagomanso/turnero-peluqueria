"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { useAdminAppointments } from "../_hooks/use-appointments";
import { formatDateFromISO, isTodayFromISO } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { DayButton } from "react-day-picker";

/* ── Shared helpers ── */

function getDayColor(count: number): string | undefined {
  if (count === 0) return undefined;
  if (count <= 4) return "bg-green-500/20 !text-green-700 dark:!text-green-400";
  if (count <= 10)
    return "bg-amber-500/20 !text-amber-700 dark:!text-amber-400";
  return "bg-red-500/20 !text-red-700 dark:!text-red-400";
}

const LEGEND = [
  {
    label: "1-4 turnos",
    color: "bg-green-500/20",
    border: "border-green-500/40",
  },
  {
    label: "5-10 turnos",
    color: "bg-amber-500/20",
    border: "border-amber-500/40",
  },
  { label: "11+ turnos", color: "bg-red-500/20", border: "border-red-500/40" },
];

/* ── CalendarBody: the calendar + legend WITHOUT a popover wrapper ── */

interface CalendarBodyProps {
  cellSize?: string;
  onAfterSelect?: () => void;
}

/**
 * Calendar with colored day counts + legend.
 * Use inside your own PopoverContent (e.g. the mobile dropdown).
 */
export function AppointmentCalendarBody({
  cellSize = "3.5rem",
  onAfterSelect,
}: CalendarBodyProps) {
  const vm = useAdminAppointments();
  const [displayMonth, setDisplayMonth] = useState(vm.selectedDate);

  useEffect(() => {
    vm.fetchMonthlyCounts(displayMonth.getFullYear(), displayMonth.getMonth());
    //eslint-disable-next-line
  }, [displayMonth]);

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
      <Calendar
        mode="single"
        selected={vm.selectedDate}
        onSelect={(date) => {
          vm.handleDateSelect(date);
          onAfterSelect?.();
        }}
        month={displayMonth}
        onMonthChange={(month) => setDisplayMonth(month)}
        locale={es}
        initialFocus
        style={{ "--cell-size": cellSize } as React.CSSProperties}
        className="p-4"
        components={{ DayButton: ColoredDayButton }}
      />
      <div className="flex items-center justify-center gap-4 px-4 pb-4">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span
              className={cn("w-3 h-3 rounded-sm border", l.color, l.border)}
            />
            <span className="text-[10px] text-content-tertiary dark:text-zinc-500">
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── AppointmentCalendar: full popover with trigger button ── */

interface AppointmentCalendarProps {
  cellSize?: string;
}

/**
 * Standalone popover calendar with a "Hoy" / date button.
 * Used in the desktop appointment controls.
 */
export function AppointmentCalendar({
  cellSize = "3.5rem",
}: AppointmentCalendarProps) {
  const vm = useAdminAppointments();
  const [isOpen, setIsOpen] = useState(false);

  const dateLabel = isTodayFromISO(vm.selectedDate)
    ? "Hoy"
    : formatDateFromISO(vm.selectedDate);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        align="end"
        className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
      >
        <AppointmentCalendarBody
          cellSize={cellSize}
          onAfterSelect={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
