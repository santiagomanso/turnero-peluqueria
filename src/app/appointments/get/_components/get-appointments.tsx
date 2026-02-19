"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppointmentCard from "@/components/appointment-card";
import AppointmentSkeleton from "@/components/appointment-skeleton";
import useGetAppointments from "../../_hooks/use-get-appointment";

export default function GetAppointments() {
  const viewModel = useGetAppointments();

  const showToggleButton = viewModel.appointments.length > 0;

  return (
    <div className="flex flex-col gap-3 max-w-svh h-[75vh] overflow-hidden">
      {/* Search Form */}
      <div>
        {/* Toggle Button */}
        <AnimatePresence>
          {showToggleButton && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-between mb-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  viewModel.setIsSearchFormOpen(!viewModel.isSearchFormOpen)
                }
                className="text-content-secondary hover:text-content hover:bg-black/5 p-0 h-auto -ml-3"
              >
                {viewModel.isSearchFormOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span className="text-sm ml-1">Ocultar</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span className="text-sm ml-1">Buscar otro turno</span>
                  </>
                )}
              </Button>
              <span className="text-xs text-content-quaternary">
                Buscando: {viewModel.phone}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Search Form */}
        <AnimatePresence initial={false}>
          {viewModel.isSearchFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl p-5 border border-border-subtle shadow-sm mb-3">
                {/* Two-column header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-content leading-tight">
                      Mi turno
                    </h2>
                    <p className="text-xs text-content-tertiary mt-0.5">
                      Ingresá tu teléfono
                    </p>
                    <div className="w-6 h-px mt-1.5 bg-gold-gradient" />
                  </div>
                  <p className="text-[0.65rem] text-content-quaternary text-right max-w-28 leading-relaxed">
                    Usá el mismo número con el que agendaste.
                  </p>
                </div>

                <form onSubmit={viewModel.handleSearch} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs text-content-tertiary"
                    >
                      Número de teléfono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 3794123456"
                      value={viewModel.phone}
                      onChange={(e) => viewModel.setPhone(e.target.value)}
                      className="bg-white border border-border-soft text-content placeholder:text-content-quaternary"
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
          <h2 className="text-content text-lg font-semibold mb-2">
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
                  <h2 className="text-sm font-semibold text-content leading-tight">
                    Tus turnos
                  </h2>
                  <div className="w-6 h-px mt-1.5 bg-gold-gradient" />
                </div>
                <span className="text-xs uppercase tracking-[0.15em] text-gold font-semibold bg-white shadow-md border border-gold-border px-2 py-1 rounded-full">
                  {viewModel.appointments.length}
                </span>
              </div>
              <div className="space-y-3 overflow-y-auto pb-4">
                {viewModel.appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onDelete={viewModel.handleDelete}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-border-subtle shadow-sm text-center">
              <p className="text-content font-medium">
                No se encontraron turnos
              </p>
              <p className="text-xs text-content-quaternary mt-2 leading-relaxed">
                Verificá que el número sea correcto o agendá un nuevo turno.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
