"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingPriceProps {
  value: string;
  onChange: (value: string) => void;
}

export function BookingPrice({ value, onChange }: BookingPriceProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Costo de Reserva
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Monto que se cobra por cada turno reservado.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label
          htmlFor="cost"
          className="text-sm text-content dark:text-zinc-100"
        >
          Precio por Reserva
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-content-tertiary">
            $
          </span>
          <Input
            id="cost"
            type="number"
            min="0"
            step="100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-7 border-border-soft dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:border-gold/50"
            placeholder="0"
          />
        </div>
        <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed">
          Este costo se mostrará a los clientes durante el proceso de reserva.
          Monto en ARS.
        </p>
      </div>
    </div>
  );
}
