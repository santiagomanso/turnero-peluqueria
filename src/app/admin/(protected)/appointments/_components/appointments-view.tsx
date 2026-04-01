"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import { useAdminAppointments } from "../_hooks/use-appointments";
import { formatDateLongFromISO } from "@/lib/format-date";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";

const AppointmentsMobileDropdown = dynamic(
  () =>
    import("./appointments-mobile-dropdown").then((m) => ({
      default: m.AppointmentsMobileDropdown,
    })),
  { ssr: false },
);

export default function AdminAppointments() {
  const vm = useAdminAppointments();
  const searchParams = useSearchParams();

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const parsed = new Date(dateParam + "T12:00:00.000Z");
      if (!isNaN(parsed.getTime())) {
        vm.handleDateSelect(parsed);
        return;
      }
    }
    if (!vm.hasFetched) {
      vm.fetchAppointments(vm.selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badge =
    vm.hasFetched && !vm.isLoading && vm.appointments.length > 0
      ? vm.appointments.length
      : undefined;

  return (
    <div className="flex flex-col h-full max-md:pt-0">
      <AdminPageHeader
        title="Turnos"
        subtitle={formatDateLongFromISO(vm.selectedDate)}
        badge={badge}
        desktopControls={<AppointmentsMobileDropdown />}
        mobileControls={<AppointmentsMobileDropdown />}
      />

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
                      onDelete={vm.showCancelled ? undefined : vm.handleDelete}
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
