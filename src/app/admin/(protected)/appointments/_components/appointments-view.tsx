"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import { useAdminAppointments } from "../_hooks/use-appointments";
import { formatDateLongFromISO, formatDateFromISO } from "@/lib/format-date";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { GlobalSearchInput } from "./global-search-input";
import type { Appointment } from "@/types/appointment";

/**
 * Ring shows on a card when:
 * - It was the specific appointment clicked (highlightedAppointmentId)
 * - The search query still matches it (so clearing the input removes the ring)
 */
function isHighlighted(
  a: Appointment,
  highlightedId: string | null,
  query: string,
): boolean {
  if (!highlightedId || a.id !== highlightedId) return false;
  const q = query.trim();
  if (q.length < 5) return false;
  const lower = q.toLowerCase();
  const digits = q.replace(/\D/g, "");
  return (
    (digits.length >= 5 && a.telephone.includes(digits)) ||
    (!!a.payerEmail && a.payerEmail.toLowerCase().includes(lower)) ||
    (!!a.payerName && a.payerName.toLowerCase().includes(lower)) ||
    a.id.toLowerCase().includes(lower.replace(/^#/, ""))
  );
}

const AppointmentsMobileDropdown = dynamic(
  () =>
    import("./appointments-mobile-dropdown").then((m) => ({
      default: m.AppointmentsMobileDropdown,
    })),
  { ssr: false },
);

const AppointmentsDesktopToolbar = dynamic(
  () =>
    import("./appointments-desktop-toolbar").then((m) => ({
      default: m.AppointmentsDesktopToolbar,
    })),
  { ssr: false },
);

type ViewMode = "cards-square" | "cards-flat" | "table";

const LS_KEY = "admin-appointments-view";

const VALID_MODES: ViewMode[] = ["cards-square", "cards-flat", "table"];

function StatusChip({ status }: { status: string }) {
  if (status === "PAID")
    return (
      <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        Pagado
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/25">
        <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
        Pendiente
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-danger-soft text-danger-text border border-danger-border">
      Cancelado
    </span>
  );
}

export default function AdminAppointments() {
  const vm = useAdminAppointments();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("cards-square");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as ViewMode | null;
    if (saved && VALID_MODES.includes(saved)) {
      setViewMode(saved);
    } else {
      setViewMode(window.innerWidth >= 1024 ? "cards-square" : "cards-flat");
    }
  }, []);

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(LS_KEY, mode);
  };

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
        desktopControlsExpand
        desktopControls={
          <AppointmentsDesktopToolbar
            viewMode={viewMode}
            onViewModeChange={handleViewMode}
          />
        }
        mobileControls={
          <AppointmentsMobileDropdown
            viewMode={viewMode}
            onViewModeChange={handleViewMode}
          />
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-7 py-5 max-md:px-4">
        {/* Mobile search bar */}
        <GlobalSearchInput className="lg:hidden mb-4 w-full" />

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
                viewMode === "table" ? (
                  /* ── TABLE ── */
                  <div className="rounded-md border border-border-subtle dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border-subtle dark:border-zinc-700 bg-black/2.5 dark:bg-white/3">
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400 pl-4">
                            Hora
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400">
                            #ID
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400">
                            Nombre
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400">
                            Teléfono
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400">
                            Fecha
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400">
                            Estado
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-content-secondary dark:text-zinc-400 text-right pr-4">
                            Monto
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vm.appointments.map((appointment) => {
                          const displayName =
                            appointment.payerName ??
                            appointment.payerEmail ??
                            "Sin nombre";

                          const shortPhone = appointment.telephone.slice(-10);

                          const price = appointment.price
                            ? `$${appointment.price.toLocaleString("es-AR")}`
                            : "$0";

                          const dateISO = appointment.date
                            .toISOString()
                            .slice(0, 10);
                          const dateFormatted = formatDateFromISO(dateISO);

                          return (
                            <TableRow
                              key={appointment.id}
                              className={cn(
                                "border-border-subtle dark:border-zinc-700 transition-colors",
                                appointment.status === "CANCELLED" &&
                                  "opacity-50",
                                isHighlighted(
                                  appointment,
                                  vm.highlightedAppointmentId,
                                  vm.searchQuery,
                                ) &&
                                  "bg-gold/5 dark:bg-gold/5 ring-1 ring-inset ring-gold/30",
                              )}
                            >
                              <TableCell className="pl-4">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold font-heebo text-content dark:text-zinc-100 bg-gold/10 border border-gold/20 rounded-md px-2 py-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                                  {appointment.time}
                                </span>
                              </TableCell>

                              <TableCell className="text-sm text-content dark:text-zinc-100">
                                #{appointment.id.slice(-6).toUpperCase()}
                              </TableCell>

                              <TableCell className="text-sm text-content dark:text-zinc-100 max-w-45 truncate">
                                {displayName}
                              </TableCell>

                              <TableCell className="text-sm text-content dark:text-zinc-100 font-heebo">
                                {shortPhone}
                              </TableCell>

                              <TableCell className="text-sm text-content dark:text-zinc-100">
                                {dateFormatted}
                              </TableCell>

                              <TableCell>
                                <StatusChip status={appointment.status} />
                              </TableCell>

                              <TableCell className="text-right pr-4 text-sm font-heebo text-content dark:text-zinc-100">
                                {price}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : viewMode === "cards-square" ? (
                  /* ── CARDS SQUARE ── */
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 sm:gap-5 pb-6">
                    {vm.appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        square
                        forceSquare
                        highlighted={isHighlighted(
                          appointment,
                          vm.highlightedAppointmentId,
                          vm.searchQuery,
                        )}
                        onDelete={
                          vm.showCancelled ? undefined : vm.handleDelete
                        }
                      />
                    ))}
                  </div>
                ) : (
                  /* ── CARDS FLAT ── */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                    {vm.appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        highlighted={isHighlighted(
                          appointment,
                          vm.highlightedAppointmentId,
                          vm.searchQuery,
                        )}
                        onDelete={
                          vm.showCancelled ? undefined : vm.handleDelete
                        }
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-border-subtle dark:border-zinc-800 shadow-sm text-center w-full sm:max-w-sm sm:mx-auto lg:mx-0 mt-4">
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
