"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ALL_HOURS, Hour, HoursConfig } from "@/types/config";

interface AvailableHoursProps {
  hours: HoursConfig;
  onToggle: (hour: Hour) => void;
  onSetMax: (hour: Hour, value: number) => void;
}

export function AvailableHours({
  hours,
  onToggle,
  onSetMax,
}: AvailableHoursProps) {
  const enabledCount = Object.values(hours).filter((h) => h.enabled).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Horarios Disponibles
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Selecciona las horas habilitadas para que los clientes puedan
            reservar.
          </p>
        </div>
        <span className="text-xs font-medium text-content-tertiary dark:text-zinc-500 tabular-nums shrink-0 ml-4">
          {enabledCount} de {ALL_HOURS.length} activos
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_HOURS.map((hour) => {
          const hourConf = hours[hour];
          return (
            <div
              key={hour}
              onClick={(e) => {
                if (hourConf.enabled) {
                  const btn = (e.target as HTMLElement).closest("button");
                  if (btn) return;
                }
                onToggle(hour);
              }}
              className={cn(
                "flex flex-col gap-3 rounded-lg border p-3 cursor-pointer select-none",
                hourConf.enabled
                  ? "border-border-subtle dark:border-zinc-700 bg-surface dark:bg-linear-to-br dark:from-zinc-800 dark:to-zinc-900"
                  : "border-border-subtle dark:border-zinc-800 bg-white dark:bg-transparent",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    hourConf.enabled
                      ? "text-content dark:text-zinc-100"
                      : "text-content-secondary dark:text-zinc-700",
                  )}
                >
                  {hour}
                </span>
                <Switch
                  checked={hourConf.enabled}
                  onCheckedChange={() => onToggle(hour)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Activar horario ${hour}`}
                  className="scale-90 data-[state=checked]:bg-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  className={cn(
                    "text-xs",
                    hourConf.enabled
                      ? "text-content-tertiary dark:text-zinc-400"
                      : "text-content-quaternary dark:text-zinc-800",
                  )}
                >
                  Reservas simultáneas
                </Label>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 shrink-0 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    disabled={!hourConf.enabled || hourConf.maxBookings <= 1}
                    onClick={() => onSetMax(hour, hourConf.maxBookings - 1)}
                  >
                    <span className="text-sm font-medium">-</span>
                  </Button>
                  <span
                    className={cn(
                      "min-w-8 text-center text-sm font-semibold tabular-nums",
                      hourConf.enabled
                        ? "text-content dark:text-zinc-100"
                        : "text-content-quaternary dark:text-zinc-800",
                    )}
                  >
                    {hourConf.maxBookings}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 shrink-0 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    disabled={!hourConf.enabled || hourConf.maxBookings >= 10}
                    onClick={() => onSetMax(hour, hourConf.maxBookings + 1)}
                  >
                    <span className="text-sm font-medium">+</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
