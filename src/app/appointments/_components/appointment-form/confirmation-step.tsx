import { format } from "date-fns";
import { Calendar, Clock, Phone } from "lucide-react";
import useAppointmentForm from "../../_hooks/use-appointment-form";

type Props = {
  appointmentForm: ReturnType<typeof useAppointmentForm>;
};

export default function ConfirmationStep({ appointmentForm }: Props) {
  const formData = appointmentForm.form.getValues();

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-white mb-0">Confirmar reserva</h2>

      <div className="space-y-4">
        <p className="text-white/80 text-sm mb-2">
          Por favor revisa los detalles de tu cita antes de confirmar
        </p>

        <div className="space-y-4 grid grid-cols-2 gap-x-5">
          {/* Date */}
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="mt-0">
              <Calendar className="w-5 h-5 text-white/70" />
            </div>
            <div className="">
              <p className="text-white font-semibold">
                {format(formData.date, "dd/MM/yy")}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="mt-0">
              <Clock className="w-5 h-5 text-white/70" />
            </div>
            <div className="">
              {/* <p className="text-white/70 text-sm mb-1">Horario</p> */}
              <p className="text-white  font-semibold">{formData.time}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="mt-0">
              <Phone className="w-5 h-5 text-white/70" />
            </div>
            <div className="">
              {/* <p className="text-white/70 text-sm mb-1">Horario</p> */}
              <p className="text-white  font-semibold">
                ..{formData.telephone.slice(4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
