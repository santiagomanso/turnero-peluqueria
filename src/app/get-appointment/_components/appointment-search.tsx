"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import AppointmentCard from "./appointment-card";
import AppointmentSkeleton from "./appointment-skeleton";
import useSearchAppointment from "../_hooks/useSearchAppointment";

export default function AppointmentSearch() {
  const viewModel = useSearchAppointment();

  return (
    <div className="flex flex-col gap-6 max-w-svh h-[75vh] overflow-hidden">
      {/* Search Form - Fixed */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shrink-0">
        <form onSubmit={viewModel.handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Número de teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ej: 3794123456"
              value={viewModel.phone}
              onChange={(e) => viewModel.setPhone(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/50 py-5"
            />
            <p className="text-white/70 text-sm">
              Ingresa tu número de teléfono para buscar tus turnos
            </p>
          </div>

          <Button
            type="submit"
            disabled={viewModel.phone.length < 9 || viewModel.isSearching}
            className="w-full py-5 font-semibold bg-white text-fuchsia-950 hover:bg-white/90"
          >
            {viewModel.isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Buscar turnos
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {viewModel.isSearching && (
        <div className="space-y-3 overflow-y-auto">
          <h2 className="text-white text-lg font-semibold mb-2">
            Buscando turnos...
          </h2>
          <AppointmentSkeleton />
          <AppointmentSkeleton />
        </div>
      )}

      {/* Results - Scrollable */}
      {viewModel.hasSearched && !viewModel.isSearching && (
        <div className="flex-1 min-h-0">
          {viewModel.appointments.length > 0 ? (
            <div className="flex flex-col h-full">
              <h2 className="text-white text-lg font-semibold mb-2 shrink-0">
                Tus turnos ({viewModel.appointments.length})
              </h2>
              <div className="space-y-3 overflow-y-auto">
                {viewModel.appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <p className="text-white">
                No se encontraron turnos para este número
              </p>
              <p className="text-white/70 text-sm mt-2">
                Verifica que el número sea correcto o solicita un nuevo turno
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
