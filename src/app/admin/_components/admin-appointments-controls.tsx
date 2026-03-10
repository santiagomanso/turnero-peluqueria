"use client";

import { useState } from "react";
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

export function AppointmentControls() {
  const vm = useAdminAppointments();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const dateLabel = isTodayFromISO(vm.selectedDate)
    ? "Hoy"
    : formatDateFromISO(vm.selectedDate);

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
            locale={es}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
