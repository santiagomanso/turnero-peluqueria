"use client";

import { useState, useEffect } from "react";
import { Settings2, RefreshCw, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { ThemeMenuItem } from "@/app/admin/_components/theme-menu-item";
import { getPaymentMonthlyCountsAction } from "@/app/admin/_actions/get-payments";
import { isTodayFromISO } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { DayButton } from "react-day-picker";

// ─── Day coloring (same thresholds as appointments) ───────────────────────────

function getPaymentDayColor(count: number): string | undefined {
  if (count === 0) return undefined;
  if (count <= 4) return "bg-green-500/20 !text-green-700 dark:!text-green-400";
  if (count <= 10) return "bg-amber-500/20 !text-amber-700 dark:!text-amber-400";
  return "bg-red-500/20 !text-red-700 dark:!text-red-400";
}

const LEGEND = [
  { label: "1–4", color: "bg-green-500/20", border: "border-green-500/40" },
  { label: "5–10", color: "bg-amber-500/20", border: "border-amber-500/40" },
  { label: "11+", color: "bg-red-500/20", border: "border-red-500/40" },
];

// ─── Calendar body (payments) ─────────────────────────────────────────────────

function PaymentsCalendarBody({
  specificDate,
  onDateSelect,
}: {
  specificDate: string; // YYYY-MM-DD — always set
  onDateSelect: (date: string) => void;
}) {
  const [displayMonth, setDisplayMonth] = useState(
    new Date(specificDate + "T12:00:00.000Z"),
  );
  const [monthlyCounts, setMonthlyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getPaymentMonthlyCountsAction(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
    ).then((result) => {
      if (result.success) setMonthlyCounts(result.data);
    });
  }, [displayMonth]);

  const selected = new Date(specificDate + "T12:00:00.000Z");

  const ColoredDayButton = (props: React.ComponentProps<typeof DayButton>) => {
    const dateKey = props.day.date.toISOString().split("T")[0];
    const count = monthlyCounts[dateKey] ?? 0;
    const colorClass = getPaymentDayColor(count);
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
        selected={selected}
        onSelect={(date) => {
          if (date) onDateSelect(format(date, "yyyy-MM-dd"));
        }}
        month={displayMonth}
        onMonthChange={setDisplayMonth}
        locale={es}
        initialFocus
        style={{ "--cell-size": "2.75rem" } as React.CSSProperties}
        className="p-4"
        components={{ DayButton: ColoredDayButton }}
      />
      <div className="flex items-center justify-center gap-3 px-4 pb-4">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn("w-3 h-3 rounded-sm border", l.color, l.border)} />
            <span className="text-[10px] text-content-tertiary dark:text-zinc-500">
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

interface PaymentsMobileDropdownProps {
  specificDate: string; // YYYY-MM-DD — always set
  isLoading: boolean;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

export function PaymentsMobileDropdown({
  specificDate,
  isLoading,
  onDateChange,
  onRefresh,
}: PaymentsMobileDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateLabel = isTodayFromISO(specificDate)
    ? "Hoy"
    : format(new Date(specificDate + "T12:00:00.000Z"), "dd/MM/yyyy");

  return (
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
        {/* Refresh */}
        <DropdownMenuItem
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </DropdownMenuItem>

        <DropdownMenuSeparator className="dark:bg-zinc-800" />

        {/* Calendar picker */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                !isTodayFromISO(specificDate) && "text-gold",
              )}
            >
              <CalendarDays
                className={cn(
                  "w-3.5 h-3.5",
                  !isTodayFromISO(specificDate) ? "text-gold" : "",
                )}
              />
              {dateLabel}
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
          >
            <PaymentsCalendarBody
              specificDate={specificDate}
              onDateSelect={(date) => {
                onDateChange(date);
                setCalendarOpen(false);
                setDropdownOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <DropdownMenuSeparator className="dark:bg-zinc-800" />
        <ThemeMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
