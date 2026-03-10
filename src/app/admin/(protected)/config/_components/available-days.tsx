"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { DAYS, DayKey, DaysConfig } from "@/types/config";

interface AvailableDaysProps {
  days: DaysConfig;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
}

export function AvailableDays({
  days,
  selectedDay,
  onSelectDay,
}: AvailableDaysProps) {
  const enabledCount = Object.values(days).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Días Disponibles
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Activá horarios para habilitar un día para reservas.
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
            onClick={() => onSelectDay(day.key)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-2.5 cursor-pointer select-none",
              selectedDay === day.key
                ? "ring-1 ring-gold/30 border-gold/50 dark:border-gold/40"
                : "",
              days[day.key]
                ? "bg-surface dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-900 text-content dark:text-zinc-100"
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
            <div className="relative">
              <Switch
                checked={days[day.key]}
                onCheckedChange={() => {}}
                aria-label={`Estado ${day.label}`}
                className="data-[state=checked]:bg-blue-500"
              />
              <div className="absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
