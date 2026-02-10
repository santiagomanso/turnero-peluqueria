"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller } from "react-hook-form";
import useAppointmentForm from "../hooks/use-appointment-form";
import { es } from "date-fns/locale";

type Props = {
  appointmentForm: ReturnType<typeof useAppointmentForm>;
};

export default function DateStep({ appointmentForm }: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-0">Fecha</h2>
      <FieldGroup className="flex-1 flex flex-col">
        <Controller
          name="date"
          control={appointmentForm.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="">
              <FieldLabel htmlFor="date" className="text-white">
                Seleccionar fecha
              </FieldLabel>

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={(date) => {
                    field.onChange(date || new Date());
                  }}
                  locale={es}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    return date <= today;
                  }}
                  className="rounded-md border border-white/30 bg-white/10"
                />
              </div>

              <FieldDescription className="text-white/70 text-center mt-2">
                Selecciona una fecha para tu cita. Las fechas pasadas no están
                disponibles.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-300 text-center"
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
