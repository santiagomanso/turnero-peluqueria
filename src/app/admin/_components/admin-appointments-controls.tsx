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
import { formatDateShort, isToday } from "@/lib/format-date";
import AdminCreateAppointment from "./admin-create-appointment";

export function AppointmentControls() {
  const vm = useAdminAppointments();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateLabel = isToday(vm.selectedDate)
    ? "Hoy"
    : formatDateShort(vm.selectedDate);

  return (
    <div className="flex items-center gap-2">
      <AdminCreateAppointment />

      <Button
        variant="outline"
        size="icon"
        onClick={vm.handleRefresh}
        disabled={vm.isLoading}
        className="h-9 w-9 shadow-sm"
      >
        <RefreshCw
          className={`w-4 h-4 ${vm.isLoading ? "animate-spin" : ""}`}
        />
      </Button>

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
