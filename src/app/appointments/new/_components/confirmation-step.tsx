"use client";

import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { formatDateNumericFromISO } from "@/lib/format-date";
import { Calendar, Clock, DollarSign, Phone } from "lucide-react";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
  bookingCost: number;
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
    <div className="flex items-center gap-3 p-4 rounded-md bg-white dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 shadow-sm">
      <Icon className="w-4 h-4 shrink-0 text-gold" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary dark:text-zinc-500 mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-sm text-content dark:text-zinc-100">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatPhone(telephone: string): string {
  const digits = telephone.replace(/\D/g, "").slice(-10);
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export default function ConfirmationStep({
  appointmentForm,
  bookingCost,
}: Props) {
  const formData = appointmentForm.form.getValues();
  const formattedBase = `$${bookingCost.toLocaleString("es-AR")}`;

  return (
    <div>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-bold text-content dark:text-zinc-100 leading-tight">
            Confirmá
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-1">
            Revisá tus datos
          </p>
          <div className="w-8 h-px mt-2 bg-gold-gradient" />
        </div>
        <div className="text-right max-w-42">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mb-1.5">
            Paso 4 de 5
          </p>
          <p className="text-xs text-content-quaternary dark:text-zinc-600 leading-relaxed">
            Verificá que todo sea{" "}
            <strong className="text-content-secondary dark:text-zinc-400">
              correcto
            </strong>{" "}
            antes de agendar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InfoCard
          icon={Calendar}
          label="Fecha"
          value={formatDateNumericFromISO(formData.date)}
        />
        <InfoCard icon={Clock} label="Hora" value={formData.time} />
        <InfoCard
          icon={Phone}
          label="Teléfono"
          value={formatPhone(formData.telephone)}
        />
        <InfoCard icon={DollarSign} label="Precio" value={formattedBase} />
      </div>
    </div>
  );
}
