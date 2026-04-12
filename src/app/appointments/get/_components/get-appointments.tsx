"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import useGetAppointments from "../../_hooks/use-get-appointment";
import { formatPhoneAsYouType } from "@/lib/format-phone";

// ─── Desktop sidebar ───────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle dark:border-zinc-800 py-8 px-4 gap-1">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gold/10 dark:bg-gold/10">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gold text-white">
          <Phone className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm leading-tight font-medium text-content dark:text-zinc-100 truncate">
            Consultar turno
          </p>
          <p className="text-[0.65rem] text-content-quaternary dark:text-zinc-600 truncate mt-0.5">
            Ingresá tu teléfono
          </p>
        </div>
      </div>
    </aside>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function GetAppointments() {
  const viewModel = useGetAppointments();

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex flex-1 min-h-0">
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-12 lg:py-10">
          {/* Page header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-content dark:text-zinc-100 leading-tight">
                Mi turno
              </h1>
              <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-1">
                Ingresá tu teléfono
              </p>
              <div className="w-8 h-px mt-2 bg-gold-gradient" />
            </div>
            <div className="text-right max-w-40 shrink-0 ml-4">
              <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
                Consultar
              </p>
              <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
                Usá el mismo número con el que{" "}
                <strong className="text-content-secondary dark:text-zinc-300">
                  agendaste
                </strong>
                .
              </p>
            </div>
          </div>

          {/* Search form */}
          <AnimatePresence initial={false}>
            {viewModel.isSearchFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={viewModel.handleSearch}
                  className="space-y-3 lg:max-w-lg"
                >
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs text-content-tertiary dark:text-zinc-500"
                    >
                      Número de teléfono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 3794 123-456"
                      value={formatPhoneAsYouType(viewModel.phone)}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        viewModel.setPhone(digits);
                      }}
                      className="font-mono tracking-widest"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      viewModel.phone.length < 9 || viewModel.isSearching
                    }
                    className="w-full font-semibold bg-gold text-white hover:bg-gold/90"
                  >
                    {viewModel.isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Buscar turnos
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeleton */}
          {viewModel.isSearching && (
            <div className="space-y-3 mt-4 lg:max-w-lg">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          )}

          {/* Results */}
          {viewModel.hasSearched && !viewModel.isSearching && (
            <div className="mt-6">
              {viewModel.appointments.length > 0 ? (
                <div>
                  <div className="flex justify-between items-start mb-3 lg:max-w-lg">
                    <div>
                      <h2 className="text-sm font-semibold text-content dark:text-zinc-100 leading-tight">
                        Tus turnos
                      </h2>
                      <div className="w-6 h-px mt-1.5 bg-gold-gradient" />
                    </div>
                    <div className="flex items-center justify-center bg-white dark:bg-zinc-800 shadow-md border border-gold-border min-w-7 h-7 px-1.5 rounded-full">
                      <span className="text-xs uppercase tracking-[0.15em] text-gold font-semibold">
                        {viewModel.appointments.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pb-8 lg:max-w-lg">
                    {viewModel.appointments.map((appointment) => (
                      <AppointmentCard
                        publicView
                        key={appointment.id}
                        appointment={appointment}
                        onDelete={viewModel.handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-border-subtle dark:border-zinc-800 shadow-sm text-center lg:max-w-sm">
                  <p className="text-content dark:text-zinc-100 font-medium">
                    No se encontraron turnos
                  </p>
                  <p className="text-xs text-content-quaternary dark:text-zinc-500 mt-2 leading-relaxed">
                    Verificá que el número sea correcto o agendá un nuevo turno.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
