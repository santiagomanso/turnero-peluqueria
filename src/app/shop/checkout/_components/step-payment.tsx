"use client";

import { CreditCard, Store } from "lucide-react";
import type { PaymentMethod } from "@/types/shop";

export default function StepPayment({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange("mercadopago")}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
          value === "mercadopago"
            ? "border-gold bg-gold/5 dark:bg-gold/10"
            : "border-border-subtle dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
      >
        <CreditCard
          className={`w-6 h-6 ${value === "mercadopago" ? "text-gold" : "text-content-tertiary dark:text-zinc-500"}`}
          strokeWidth={1.5}
        />
        <span
          className={`text-xs font-bold ${value === "mercadopago" ? "text-gold" : "text-content dark:text-zinc-300"}`}
        >
          MercadoPago
        </span>
        <span className="text-[0.55rem] text-content-quaternary dark:text-zinc-500 text-center">
          Pagá online ahora
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChange("local")}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
          value === "local"
            ? "border-gold bg-gold/5 dark:bg-gold/10"
            : "border-border-subtle dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
      >
        <Store
          className={`w-6 h-6 ${value === "local" ? "text-gold" : "text-content-tertiary dark:text-zinc-500"}`}
          strokeWidth={1.5}
        />
        <span
          className={`text-xs font-bold ${value === "local" ? "text-gold" : "text-content dark:text-zinc-300"}`}
        >
          Pagar en el local
        </span>
        <span className="text-[0.55rem] text-content-quaternary dark:text-zinc-500 text-center">
          Pagás al retirar
        </span>
      </button>
    </div>
  );
}
