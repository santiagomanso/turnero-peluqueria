"use client";

import { es } from "date-fns/locale";
import { CalendarDays, RefreshCw, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import { formatDateShort, formatDateLong, isToday } from "@/lib/format-date";
import { logoutAdminAction } from "../_actions/verify-admin-password";

export default function AdminAppointments() {
  const vm = useAdminAppointments();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
  };

  const dateLabel = isToday(vm.selectedDate)
    ? "Hoy"
    : formatDateShort(vm.selectedDate);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-content leading-tight">
            Turnos del día
          </h1>
          <div className="w-6 h-px mt-1.5 bg-gold-gradient" />
        </div>

        <div className="flex items-center gap-2">
          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 text-content-quaternary hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            onClick={vm.handleRefresh}
            disabled={vm.isLoading}
            className="h-9 w-9 text-content-secondary hover:text-content hover:bg-black/5"
          >
            <RefreshCw
              className={`w-4 h-4 ${vm.isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          {/* Date picker */}
          <Popover open={vm.isCalendarOpen} onOpenChange={vm.setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 px-3 gap-2 text-sm font-semibold text-content border border-border-subtle bg-white shadow-sm hover:bg-black/4!"
              >
                <CalendarDays className="w-4 h-4 text-gold" />
                {dateLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-border-subtle shadow-lg rounded-xl">
              <Calendar
                mode="single"
                selected={vm.selectedDate}
                onSelect={vm.handleDateSelect}
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Count badge */}
      {vm.hasFetched && !vm.isLoading && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs uppercase tracking-[0.15em] text-gold font-semibold bg-white shadow-md border border-gold-border px-2 py-1 rounded-full">
            {vm.appointments.length}{" "}
            {vm.appointments.length === 1 ? "turno" : "turnos"}
          </span>
          <span className="text-xs text-content-quaternary">
            {formatDateLong(vm.selectedDate)}
          </span>
        </div>
      )}

      {/* Loading */}
      {vm.isLoading && (
        <div className="space-y-3 overflow-y-auto">
          <AppointmentSkeleton />
          <AppointmentSkeleton />
          <AppointmentSkeleton />
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {vm.hasFetched && !vm.isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-h-0 overflow-y-auto"
          >
            {vm.appointments.length > 0 ? (
              <div className="space-y-3 pb-4">
                {vm.appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onDelete={vm.handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 border border-border-subtle shadow-sm text-center">
                <p className="text-content font-medium">Sin turnos</p>
                <p className="text-xs text-content-quaternary mt-2 leading-relaxed">
                  No hay turnos agendados para este día.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
