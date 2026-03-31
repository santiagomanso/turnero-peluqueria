"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ALL_HOURS, HoursConfig, DayKey } from "@/types/config";

interface AvailableHoursProps {
  hours: HoursConfig;
  selectedDay: DayKey;
  onToggle: (day: DayKey, hour: string) => void;
  onSetMax: (day: DayKey, hour: string, delta: number) => void;
}

const DAY_FULL_LABELS: Record<DayKey, string> = {
  monday: "LUNES",
  tuesday: "MARTES",
  wednesday: "MIÉRCOLES",
  thursday: "JUEVES",
  friday: "VIERNES",
  saturday: "SÁBADO",
  sunday: "DOMINGO",
};

export function AvailableHours({
  hours,
  selectedDay,
  onToggle,
  onSetMax,
}: AvailableHoursProps) {
  const dayHours = hours[selectedDay] ?? {};
  const enabledCount = Object.values(dayHours).filter((h) => h.enabled).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Horarios Disponibles
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Mostrando horarios para{" "}
            <span className="text-gold font-medium">
              {DAY_FULL_LABELS[selectedDay]}
            </span>
          </p>
        </div>
        <span className="text-xs font-medium text-content-tertiary dark:text-zinc-500 tabular-nums shrink-0 ml-4">
          {enabledCount} de {ALL_HOURS.length} activos
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_HOURS.map((hour) => {
          const hourConf = dayHours[hour] ?? { enabled: false, maxBookings: 1 };
          return (
            <div
              key={hour}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-slot="button"]'))
                  return;
                onToggle(selectedDay, hour);
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
                  onCheckedChange={() => onToggle(selectedDay, hour)}
                  onPointerDown={(e) => e.stopPropagation()}
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
                <div
                  className="flex items-center gap-1.5"
                  onPointerDown={(e) => {
                    if (
                      (e.target as HTMLElement).closest('[data-slot="button"]')
                    ) {
                      e.stopPropagation();
                    }
                  }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 shrink-0 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    disabled={!hourConf.enabled || hourConf.maxBookings <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetMax(selectedDay, hour, -1);
                    }}
                  >
                    <span className="text-sm font-medium pointer-events-none">
                      -
                    </span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetMax(selectedDay, hour, +1);
                    }}
                  >
                    <span className="text-sm font-medium pointer-events-none">
                      +
                    </span>
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
