"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller } from "react-hook-form";
import useAppointmentForm from "../../_hooks/use-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useAppointmentForm>;
};

export default function HourStep({ appointmentForm }: Props) {
  return (
    <div className="">
      <h2 className="text-2xl font-bold text-white mb-0">Hora</h2>
      <FieldGroup className="flex-1 flex flex-col justify-center">
        <Controller
          name="time"
          control={appointmentForm.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="time" className="text-white mb-4">
                Seleccionar hora
              </FieldLabel>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {appointmentForm.availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => field.onChange(time)}
                    className={`px-4 py-3 rounded-full font-semibold transition-all ${
                      field.value === time
                        ? "bg-white text-fuchsia-950 shadow-lg scale-105"
                        : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <FieldDescription className="text-white/70 text-center mt-4">
                Horarios disponibles: 08:00 - 11:00 y 16:00 - 18:00
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
