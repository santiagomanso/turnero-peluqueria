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
        variant="ghost"
        size="icon"
        onClick={vm.handleRefresh}
        disabled={vm.isLoading}
        className="h-9 w-9 border border-border-subtle bg-white shadow-sm text-content-secondary hover:text-content hover:bg-gold/8"
      >
        <RefreshCw
          className={`w-4 h-4 ${vm.isLoading ? "animate-spin" : ""}`}
        />
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 px-3 gap-2 text-sm font-semibold text-content-secondary border border-border-subtle bg-white shadow-sm hover:text-content hover:bg-gold/8!"
          >
            <CalendarDays className="w-4 h-4 text-gold" />
            {dateLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border border-border-subtle shadow-lg rounded-xl">
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
