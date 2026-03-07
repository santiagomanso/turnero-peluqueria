"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DAYS = [
  { key: "monday", label: "Lun" },
  { key: "tuesday", label: "Mar" },
  { key: "wednesday", label: "Mie" },
  { key: "thursday", label: "Jue" },
  { key: "friday", label: "Vie" },
  { key: "saturday", label: "Sab" },
  { key: "sunday", label: "Dom" },
] as const;

export type DayKey = (typeof DAYS)[number]["key"];
export type DaysConfig = Record<DayKey, boolean>;

interface AvailableDaysProps {
  days: DaysConfig;
  onToggle: (day: DayKey) => void;
}

export function AvailableDays({ days, onToggle }: AvailableDaysProps) {
  const enabledCount = Object.values(days).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Días Disponibles
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Selecciona los días de la semana habilitados para reservas.
          </p>
        </div>
        <span className="text-xs font-medium text-content-tertiary dark:text-zinc-500 tabular-nums shrink-0 ml-4">
          {enabledCount} de {DAYS.length} activos
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {DAYS.map((day) => (
          <div
            key={day.key}
            onClick={() => onToggle(day.key)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-2.5 cursor-pointer select-none",
              days[day.key]
                ? "border-border-subtle dark:border-zinc-700 bg-surface dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-900 text-content dark:text-zinc-100"
                : "border-border-subtle dark:border-zinc-800 bg-white dark:bg-transparent text-content-secondary dark:text-zinc-700 hover:border-gold/20 hover:bg-gold/5",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium",
                days[day.key] ? "dark:text-zinc-100" : "dark:text-zinc-700",
              )}
            >
              {day.label}
            </span>
            <Switch
              checked={days[day.key]}
              onCheckedChange={() => onToggle(day.key)}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Activar ${day.label}`}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
