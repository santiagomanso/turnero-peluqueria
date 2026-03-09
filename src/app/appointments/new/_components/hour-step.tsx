"use client";

import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

type Props = { appointmentForm: ReturnType<typeof useCreateAppointmentForm> };

export default function HourStep({ appointmentForm }: Props) {
  const { availableHours, isLoadingHours } = appointmentForm;

  const morning = availableHours.filter((h) => {
    const hour = parseInt(h.time.split(":")[0]);
    return hour < 13;
  });

  const afternoon = availableHours.filter((h) => {
    const hour = parseInt(h.time.split(":")[0]);
    return hour >= 13;
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-bold text-content dark:text-zinc-100 leading-tight">
            Hora
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-1">
            Seleccionar hora
          </p>
          <div className="w-8 h-px mt-2 bg-gold-gradient" />
        </div>
        <div className="text-right max-w-36">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
            Paso 2 de 4
          </p>
          <p className="text-xs text-content-quaternary dark:text-zinc-600 leading-relaxed">
            Cancelaciones con{" "}
            <strong className="text-content-secondary dark:text-zinc-400">
              +24 hs
            </strong>{" "}
            de anticipación.
          </p>
        </div>
      </div>

      {isLoadingHours ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <Loader2 className="w-5 h-5 animate-spin text-gold" />
          <p className="text-xs text-content-quaternary dark:text-zinc-600 uppercase tracking-widest">
            Cargando horarios...
          </p>
        </div>
      ) : (
        <FieldGroup>
          <Controller
            name="time"
            control={appointmentForm.form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {morning.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[0.6rem] uppercase tracking-[0.12em] text-gold font-semibold mb-2">
                      Mañana
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {morning.map((h) => (
                        <button
                          key={h.time}
                          type="button"
                          disabled={!h.available}
                          onClick={() => field.onChange(h.time)}
                          className={cn(
                            "py-2.5 rounded-md text-sm font-semibold transition-all",
                            field.value === h.time
                              ? "bg-gold text-white shadow-md shadow-neutral-300 dark:shadow-zinc-950 dark:shadow-xl"
                              : h.available
                                ? "bg-muted dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 text-content dark:text-zinc-100 shadow-sm"
                                : "bg-muted dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-content-quaternary dark:text-zinc-600 line-through cursor-not-allowed opacity-50",
                          )}
                        >
                          {h.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {afternoon.length > 0 && (
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.12em] text-gold font-semibold mb-2">
                      Tarde
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {afternoon.map((h) => (
                        <button
                          key={h.time}
                          type="button"
                          disabled={!h.available}
                          onClick={() => field.onChange(h.time)}
                          className={cn(
                            "py-2.5 rounded-md text-sm font-semibold transition-all",
                            field.value === h.time
                              ? "bg-gold text-white shadow-md shadow-neutral-300 dark:shadow-zinc-950 dark:shadow-xl"
                              : h.available
                                ? "bg-muted dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 text-content dark:text-zinc-100 shadow-sm"
                                : "bg-muted dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-content-quaternary dark:text-zinc-600 line-through cursor-not-allowed opacity-50",
                          )}
                        >
                          {h.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoadingHours && availableHours.length === 0 && (
                  <p className="text-center text-sm text-content-tertiary dark:text-zinc-500 py-8">
                    No hay horarios disponibles para este día.
                  </p>
                )}

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-red-400 text-center mt-2"
                  />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      )}
    </div>
  );
}
