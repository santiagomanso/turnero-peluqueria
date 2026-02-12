import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import useAppointmentForm from "../../_hooks/use-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useAppointmentForm>;
};

export default function TelephoneStep({ appointmentForm }: Props) {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-white mb-6">Número de teléfono</h2>

      <FieldGroup>
        <Controller
          name="telephone"
          control={appointmentForm.form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="telephone" className="text-white mb-2">
                Teléfono de contacto
              </FieldLabel>

              <Input
                {...field}
                id="telephone"
                type="tel"
                placeholder="Ej: 3794123456"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    appointmentForm.handleNext();
                  }
                }}
              />

              <FieldDescription className="text-white/70 mt-2">
                Ingrese su número de teléfono para confirmar la cita
              </FieldDescription>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-red-300 mt-2"
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
