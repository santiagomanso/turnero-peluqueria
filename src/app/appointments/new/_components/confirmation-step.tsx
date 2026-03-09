"use client";

import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { formatDateNumericFromISO } from "@/lib/format-date";
import { useState } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Phone,
  Tag,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [discountInput, setDiscountInput] = useState("");
  const {
    appliedDiscount,
    isValidatingDiscount,
    applyDiscount,
    removeDiscount,
  } = appointmentForm;

  const formData = appointmentForm.form.getValues();

  const finalPrice = appliedDiscount
    ? Math.round(bookingCost * (1 - appliedDiscount.discount / 100))
    : bookingCost;

  const formattedBase = `$${bookingCost.toLocaleString("es-AR")}`;
  const formattedFinal = `$${finalPrice.toLocaleString("es-AR")}`;

  const handleApply = () => {
    applyDiscount(discountInput);
  };

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
            Paso 4 de 4
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

        {/* Precio card — cambia según descuento */}
        {appliedDiscount ? (
          <div className="flex items-center gap-3 p-4 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <Tag className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
            <div className="flex-1 min-w-0">
              <p className="text-[0.6rem] uppercase tracking-wider text-green-600 dark:text-green-400 mb-0.5">
                -{appliedDiscount.discount}% · {appliedDiscount.code}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs line-through text-green-400 dark:text-green-600">
                  {formattedBase}
                </p>
                <p className="font-bold text-sm text-green-700 dark:text-green-300">
                  {formattedFinal}
                </p>
              </div>
            </div>
            <button
              onClick={removeDiscount}
              className="text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <InfoCard icon={DollarSign} label="Precio" value={formattedBase} />
        )}

        {/* Input código de descuento */}
        <div className="md:col-span-2 flex gap-2">
          <Input
            type="text"
            placeholder="Código de descuento"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
            onKeyDown={(e) =>
              e.key === "Enter" && !appliedDiscount && handleApply()
            }
            disabled={!!appliedDiscount || isValidatingDiscount}
            className="font-mono tracking-widest"
          />
          <button
            onClick={handleApply}
            disabled={
              !discountInput.trim() || isValidatingDiscount || !!appliedDiscount
            }
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold/90 transition-colors shrink-0"
          >
            {isValidatingDiscount ? "..." : "Aplicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
