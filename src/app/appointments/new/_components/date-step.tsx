"use client";

import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { es } from "date-fns/locale";
import type { WeekProps } from "react-day-picker";
import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
  allowToday?: boolean;
  hideHeader?: boolean;
};

export default function DateStep({
  appointmentForm,
  allowToday = false,
  hideHeader = false,
}: Props) {
  const { daysConfig, fullDates } = appointmentForm;

  const isDayDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (allowToday ? date < today : date <= today) return true;

    if (fullDates.some((d) => d.toDateString() === date.toDateString()))
      return true;

    if (daysConfig) {
      const jsDay = date.getUTCDay();
      const dayKeyMap: Record<number, keyof typeof daysConfig> = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      };
      const key = dayKeyMap[jsDay];
      if (!daysConfig[key]) return true;
    }

    return false;
  };

  const firstAvailableMonth = allowToday
    ? new Date()
    : (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })();

  // Hide calendar rows where every day falls before the booking cutoff.
  // Prevents large blank space at the top when the first weeks of the month are all past.
  const FilteredWeek = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = allowToday ? today : new Date(today.getTime() + 86_400_000);
    return function FilteredWeek({ week, children, ...props }: WeekProps) {
      if (week.days.every((d) => d.date < cutoff))
        return <tr {...props} style={{ display: "none" }} />;
      return <tr {...props}>{children}</tr>;
    };
  }, [allowToday]);

  return (
    <div className="flex flex-col">
      {!hideHeader && (
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
      )}
      <FieldGroup className="flex flex-col">
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
                disabled={isDayDisabled}
                defaultMonth={field.value ?? firstAvailableMonth}
                showOutsideDays={false}
                classNames={{
                  disabled: "invisible pointer-events-none",
                }}
                components={{ Week: FilteredWeek }}
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
