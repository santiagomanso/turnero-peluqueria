import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Phone } from "lucide-react";
import useAppointmentForm from "../hooks/use-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useAppointmentForm>;
};

export default function ConfirmationStep({ appointmentForm }: Props) {
  const formData = appointmentForm.form.getValues();

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-white mb-6">Confirmar reserva</h2>

      <div className="space-y-4 bg-white/10 rounded-lg p-6 backdrop-blur-sm">
        <p className="text-white/80 text-sm mb-4">
          Por favor revisa los detalles de tu cita antes de confirmar
        </p>

        <div className="space-y-4">
          {/* Date */}
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="mt-1">
              <Calendar className="w-5 h-5 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-1">Fecha de la cita</p>
              <p className="text-white text-lg font-semibold">
                {formData.date
                  ? format(formData.date, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })
                  : "No especificada"}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="mt-1">
              <Clock className="w-5 h-5 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-1">Horario</p>
              <p className="text-white text-lg font-semibold">
                {formData.time || "No especificado"}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="mt-1">
              <Phone className="w-5 h-5 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-1">Teléfono de contacto</p>
              <p className="text-white text-lg font-semibold">
                {formData.telephone || "No especificado"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/30">
          <p className="text-white/90 text-sm">
            ✓ Al confirmar, recibirás un mensaje de confirmación al número de
            teléfono proporcionado.
          </p>
        </div>
      </div>

      {/* Debug: Show what will be sent to database */}
      <details className="mt-6">
        <summary className="text-white/70 text-sm cursor-pointer hover:text-white">
          Ver datos que se enviarán (Debug)
        </summary>
        <pre className="mt-2 p-4 bg-black/30 rounded-lg text-white/80 text-xs overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </details>
    </div>
  );
}
