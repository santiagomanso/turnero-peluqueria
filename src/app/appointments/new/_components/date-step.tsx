"use client";

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { es } from "date-fns/locale";
import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
  allowToday?: boolean;
};

export default function DateStep({
  appointmentForm,
  allowToday = false,
}: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-content dark:text-zinc-100 leading-tight">
            Fecha
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-1">
            Seleccionar fecha
          </p>
          <div className="w-8 h-px mt-2 bg-gold-gradient" />
        </div>
        <div className="text-right max-w-36">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
            Paso 1 de 4
          </p>
          {!allowToday && (
            <p className="text-[0.65rem] text-content-quaternary dark:text-zinc-600 leading-relaxed">
              Turnos con{" "}
              <strong className="text-content-secondary dark:text-zinc-400">
                +24 hs
              </strong>{" "}
              de anticipación.
            </p>
          )}
        </div>
      </div>
      <FieldGroup className="flex-1 flex flex-col">
        <Controller
          name="date"
          control={appointmentForm.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Calendar
                mode="single"
                selected={field.value || undefined}
                onSelect={(date) => {
                  if (date) field.onChange(date);
                }}
                locale={es}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return allowToday ? date < today : date <= today;
                }}
                className="w-full"
              />
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
