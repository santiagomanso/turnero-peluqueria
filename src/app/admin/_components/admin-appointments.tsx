"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import { formatDateLongFromISO } from "@/lib/format-date";

const AppointmentControls = dynamic(
  () =>
    import("./admin-appointments-controls").then((m) => ({
      default: m.AppointmentControls,
    })),
  { ssr: false },
);

export default function AdminAppointments() {
  const vm = useAdminAppointments();

  useEffect(() => {
    if (!vm.hasFetched) {
      vm.fetchAppointments(vm.selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full max-md:pt-0">
      {/* Page header — desktop only */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center gap-4 max-md:hidden">
        <div className="relative pr-5">
          <div className="relative inline-block">
            <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
              Turnos
            </h1>
            {vm.hasFetched && !vm.isLoading && vm.appointments.length > 0 && (
              <span className="absolute -top-1 -right-4.5 min-w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold text-white bg-gold rounded-full px-1 leading-none">
                {vm.appointments.length}
              </span>
            )}
          </div>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            {formatDateLongFromISO(vm.selectedDate)}
          </p>
        </div>
        <AppointmentControls />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-7 py-5 max-md:px-4">
        {vm.isLoading && (
          <div className="space-y-3">
            <AppointmentSkeleton />
            <AppointmentSkeleton />
            <AppointmentSkeleton />
          </div>
        )}

        <AnimatePresence>
          {vm.hasFetched && !vm.isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {vm.appointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  {vm.appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onDelete={vm.handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-border-subtle dark:border-zinc-800 shadow-sm text-center max-w-sm mt-4">
                  <p className="text-content dark:text-zinc-100 font-medium">
                    Sin turnos
                  </p>
                  <p className="text-xs text-content-quaternary dark:text-zinc-500 mt-2 leading-relaxed">
                    No hay turnos agendados para este día.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
