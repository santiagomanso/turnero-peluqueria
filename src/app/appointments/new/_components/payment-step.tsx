"use client";

import useCreateAppointmentForm from "@/app/appointments/_hooks/use-create-appointment-form";
import { CreditCard, Tag, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  appointmentForm: ReturnType<typeof useCreateAppointmentForm>;
  bookingCost: number;
  hideHeader?: boolean;
};

export default function PaymentStep({ appointmentForm, bookingCost, hideHeader = false }: Props) {
  const [discountInput, setDiscountInput] = useState("");
  const { appliedDiscount, isValidatingDiscount, applyDiscount, removeDiscount } =
    appointmentForm;

  const formattedBase = `$${bookingCost.toLocaleString("es-AR")}`;
  const finalPrice = appliedDiscount
    ? Math.round(bookingCost * (1 - appliedDiscount.discount / 100))
    : bookingCost;
  const formattedFinal = `$${finalPrice.toLocaleString("es-AR")}`;

  const handleApply = () => applyDiscount(discountInput);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      {!hideHeader && (
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-content dark:text-zinc-100 leading-tight">
              Método de pago
            </h2>
            <div className="w-8 h-px mt-2 bg-gold-gradient" />
          </div>
          <span className="text-[0.6rem] uppercase tracking-[0.15em] text-gold font-semibold mt-1">
            Paso 5 de 5
          </span>
        </div>
      )}

      {/* Código de descuento */}
      {appliedDiscount ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
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
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Código de descuento"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
            onKeyDown={(e) =>
              e.key === "Enter" && !appliedDiscount && handleApply()
            }
            disabled={isValidatingDiscount}
            className="font-mono tracking-widest"
          />
          <button
            onClick={handleApply}
            disabled={!discountInput.trim() || isValidatingDiscount}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold/90 transition-colors shrink-0"
          >
            {isValidatingDiscount ? "..." : "Aplicar"}
          </button>
        </div>
      )}

      {/* MercadoPago card — premium style */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-gold bg-linear-to-br from-gold/8 to-gold/3 dark:from-gold/12 dark:to-gold/5 p-5">
        {/* Decorative background ring */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gold/10 dark:bg-gold/8 pointer-events-none" />
        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-gold/6 pointer-events-none" />

        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gold/15 dark:bg-gold/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-gold" strokeWidth={1.5} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gold text-sm leading-tight">
              MercadoPago
            </p>
            <p className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 mt-0.5">
              Pagá online de forma segura
            </p>
          </div>

          {/* Selected checkmark */}
          <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center shrink-0">
            <svg viewBox="0 0 10 10" className="w-3 h-3 text-white fill-none stroke-white stroke-[1.5]">
              <path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Credit/debit card info */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface dark:bg-zinc-800/60 border border-border-subtle dark:border-zinc-700">
        <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="text-xs text-content-tertiary dark:text-zinc-400 leading-relaxed">
          También podés pagar con{" "}
          <span className="font-semibold text-content-secondary dark:text-zinc-300">
            tarjeta de crédito o débito
          </span>
          . Al llegar a MercadoPago, seleccioná otra forma de pago.
        </p>
      </div>
    </div>
  );
}
