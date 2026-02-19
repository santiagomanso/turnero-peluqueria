import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
};

export default function TelephoneStep({ appointmentForm }: Props) {
  return (
    <div>
      {/* Two-column header */}
      <div className="flex justify-between items-start mb-6">
        {/* Left: title */}
        <div>
          <h2 className="text-2xl font-bold text-content leading-tight">
            Teléfono
          </h2>
          <p className="text-xs text-content-tertiary mt-1">
            Teléfono de contacto
          </p>
          <div className="w-8 h-px mt-2 bg-gold-gradient" />
        </div>

        {/* Right: step + policy */}
        <div className="text-right max-w-36">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
            Paso 3 de 4
          </p>
          <p className="text-[0.65rem] text-content-quaternary leading-relaxed">
            Usá este número para{" "}
            <strong className="text-content-secondary">consultar</strong> tu
            turno después.
          </p>
        </div>
      </div>

      <FieldGroup>
        <Controller
          name="telephone"
          control={appointmentForm.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="telephone"
                type="tel"
                placeholder="Ej: 3794123456"
                className="bg-white border border-border-soft text-content focus:ring-0 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    appointmentForm.handleNext();
                  }
                }}
              />

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-400 mt-2"
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
