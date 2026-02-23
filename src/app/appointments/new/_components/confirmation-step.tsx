import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { format } from "date-fns";
import { Calendar, Clock, CreditCard, DollarSign, Phone } from "lucide-react";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
};

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-md bg-white border border-border-subtle shadow-sm">
      <Icon className="w-4 h-4 shrink-0 text-gold" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-sm text-content">{value}</p>
      </div>
    </div>
  );
}

export default function ConfirmationStep({ appointmentForm }: Props) {
  const formData = appointmentForm.form.getValues();

  return (
    <div>
      {/* Two-column header */}
      <div className="flex justify-between items-start mb-5">
        {/* Left: title */}
        <div>
          <h2 className="text-2xl font-bold text-content leading-tight">
            Confirmá
          </h2>
          <p className="text-xs text-content-tertiary mt-1">Revisá tus datos</p>
          <div className="w-8 h-px mt-2 bg-gold-gradient" />
        </div>

        {/* Right: step + note */}
        <div className="text-right max-w-42">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
            Paso 4 de 4
          </p>
          <p className="text-xs text-content-quaternary leading-relaxed">
            Verificá que todo sea{" "}
            <strong className="text-content-secondary">correcto</strong> antes
            de agendar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon={Calendar}
          label="Fecha"
          value={format(formData.date, "dd/MM/yy")}
        />
        <InfoCard icon={Clock} label="Hora" value={formData.time} />
        <InfoCard
          icon={Phone}
          label="Teléfono"
          value={`..${formData.telephone.slice(4)}`}
        />
        <InfoCard icon={DollarSign} label="Precio" value="$1.000 ARS" />

        {/* Full width MP row */}
        <div className="col-span-2 flex items-center gap-3 p-4 rounded-md bg-[#009ee3]/8 border border-[#009ee3]/20">
          <CreditCard className="w-4 h-4 shrink-0 text-[#009ee3]" />
          <p className="text-xs text-content-tertiary leading-relaxed">
            El pago se procesará de forma segura a través de{" "}
            <strong className="text-content-secondary">Mercado Pago</strong>.
            Serás redirigido al checkout al confirmar.
          </p>
        </div>
      </div>
    </div>
  );
}
