"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import useGetAppointments from "../../_hooks/use-get-appointment";
import { formatPhoneAsYouType } from "@/lib/format-phone";

export default function GetAppointments() {
  const viewModel = useGetAppointments();

  return (
    <div className="flex flex-col gap-3 max-w-svh h-[75vh] overflow-hidden">
      <div className={viewModel.isSearchFormOpen ? "" : "hidden"}>
        <AnimatePresence initial={false}>
          {viewModel.isSearchFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-border-subtle dark:border-zinc-700 shadow-sm mb-3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-content dark:text-zinc-100 leading-tight">
                      Mi turno
                    </h2>
                    <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
                      Ingresá tu teléfono
                    </p>
                    <div className="w-6 h-px mt-1.5 bg-gold-gradient" />
                  </div>
                  <p className="text-[0.65rem] text-content-quaternary dark:text-zinc-500 text-right max-w-28 leading-relaxed">
                    Usá el mismo número con el que agendaste.
                  </p>
                </div>

                <form onSubmit={viewModel.handleSearch} className="space-y-3">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Skeleton */}
      {viewModel.isSearching && (
        <div className="space-y-3 overflow-y-auto">
          <h2 className="text-content dark:text-zinc-100 text-lg font-semibold mb-2">
            Buscando turnos...
          </h2>
          <AppointmentSkeleton />
          <AppointmentSkeleton />
        </div>
      )}

      {/* Results */}
      {viewModel.hasSearched && !viewModel.isSearching && (
        <div className="flex-1 min-h-0">
          {viewModel.appointments.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-3 shrink-0">
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
              <div className="space-y-3 overflow-y-auto pb-4">
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
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 border border-border-subtle dark:border-zinc-700 shadow-sm text-center">
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
  );
}
