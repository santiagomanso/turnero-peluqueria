"use client";

import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
};

const morning = ["08:00", "09:00", "10:00", "11:00"];
const afternoon = ["16:00", "17:00", "18:00"];

export default function HourStep({ appointmentForm }: Props) {
  return (
    <div>
      {/* Two-column header */}
      <div className="flex justify-between items-start mb-5">
        {/* Left: title */}
        <div>
          <h2 className="text-2xl font-bold text-content leading-tight">
            Hora
          </h2>
          <p className="text-xs text-content-tertiary mt-1">Seleccionar hora</p>
          <div className="w-8 h-px mt-2 bg-gold-gradient" />
        </div>

        {/* Right: step + policy */}
        <div className="text-right max-w-36">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
            Paso 2 de 4
          </p>
          <p className="text-xs text-content-quaternary leading-relaxed">
            Cancelaciones con{" "}
            <strong className="text-content-secondary">+24 hs</strong> de
            anticipación.
          </p>
        </div>
      </div>

      <FieldGroup>
        <Controller
          name="time"
          control={appointmentForm.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              {/* Morning */}
              <div className="mb-4">
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-gold font-semibold mb-2">
                  Mañana
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {morning.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => field.onChange(time)}
                      className={cn(
                        "py-2.5 rounded-md text-sm font-semibold transition-all",
                        field.value === time
                          ? "bg-gold text-white shadow-md shadow-neutral-300"
                          : "bg-muted border border-border-subtle text-content shadow-sm",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.12em] text-gold font-semibold mb-2">
                  Tarde
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {afternoon.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => field.onChange(time)}
                      className={cn(
                        "py-2.5 rounded-md text-sm font-semibold transition-all",
                        field.value === time
                          ? "bg-gold text-white shadow-md shadow-neutral-300"
                          : "bg-muted border border-border-subtle text-content shadow-sm",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

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
    </div>
  );
}
