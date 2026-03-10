"use client";

import * as React from "react";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveConfigAction } from "@/app/admin/_actions/save-config";
import type {
  DayKey,
  DaysConfig,
  HoursConfig,
  DiscountCode,
} from "@/types/config";
import { ALL_HOURS, DAYS } from "@/types/config";

import { AvailableDays } from "./available-days";
import { AvailableHours } from "./available-hours";
import { BookingPrice } from "./booking-price";
import { ThemeSwitcher } from "./theme-switcher";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";
import { useConfigStore } from "../_hooks/use-config-store";

import dynamic from "next/dynamic";
const DiscountCodes = dynamic(
  () => import("./discount-codes").then((m) => ({ default: m.DiscountCodes })),
  { ssr: false },
);

const DEFAULT_DAYS: DaysConfig = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

function buildDefaultHours(): HoursConfig {
  const config = {} as HoursConfig;
  for (const day of DAYS) {
    config[day.key] = {};
    for (const hour of ALL_HOURS) {
      config[day.key][hour] = { enabled: true, maxBookings: 1 };
    }
  }
  return config;
}

const DEFAULT_HOURS = buildDefaultHours();

export function ConfigView({
  initialTheme,
}: {
  initialTheme: "dark" | "light";
}) {
  const { isDark, toggle: toggleTheme } = useAdminTheme();
  const {
    data: storedConfig,
    isLoading,
    hasFetched,
    fetch: fetchConfig,
    update: updateStore,
  } = useConfigStore();

  React.useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const [days, setDays] = React.useState<DaysConfig>(DEFAULT_DAYS);
  const [savedDays, setSavedDays] = React.useState<DaysConfig>(DEFAULT_DAYS);
  const [hours, setHours] = React.useState<HoursConfig>(DEFAULT_HOURS);
  const [savedHours, setSavedHours] =
    React.useState<HoursConfig>(DEFAULT_HOURS);
  const [bookingCost, setBookingCost] = React.useState("10000");
  const [savedBookingCost, setSavedBookingCost] = React.useState("10000");
  const [theme, setTheme] = React.useState(initialTheme);
  const [savedTheme, setSavedTheme] = React.useState(initialTheme);
  const [codes, setCodes] = React.useState<DiscountCode[]>([]);
  const [savedCodes, setSavedCodes] = React.useState<DiscountCode[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<DayKey>("monday");

  const didSyncRef = React.useRef(false);
  React.useEffect(() => {
    if (hasFetched && storedConfig && !didSyncRef.current) {
      didSyncRef.current = true;
      const bc = String(storedConfig.bookingCost);

      // Sincronizar days con hours: desactivar días sin horarios activos
      const syncedDays = { ...storedConfig.days };
      for (const day of DAYS) {
        const dayHours = storedConfig.hours[day.key] ?? {};
        const anyEnabled = Object.values(dayHours).some((h) => h.enabled);
        if (!anyEnabled) {
          syncedDays[day.key] = false;
        }
      }

      setDays(syncedDays);
      setSavedDays(syncedDays);
      setHours(storedConfig.hours);
      setSavedHours(storedConfig.hours);
      setBookingCost(bc);
      setSavedBookingCost(bc);
      setCodes(storedConfig.discountCodes);
      setSavedCodes(storedConfig.discountCodes);
    }
  }, [hasFetched, storedConfig]);

  const hasChanges =
    JSON.stringify(days) !== JSON.stringify(savedDays) ||
    JSON.stringify(hours) !== JSON.stringify(savedHours) ||
    bookingCost !== savedBookingCost ||
    theme !== savedTheme ||
    JSON.stringify(codes) !== JSON.stringify(savedCodes);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveConfigAction({
      days,
      hours,
      bookingCost: Number(bookingCost),
      discountCodes: codes,
    });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error ?? "Error al guardar");
      return;
    }

    setSavedDays({ ...days });
    setSavedHours({ ...hours });
    setSavedBookingCost(bookingCost);
    setSavedTheme(theme);
    setSavedCodes([...codes]);

    updateStore({
      days,
      hours,
      bookingCost: Number(bookingCost),
      discountCodes: codes,
    });

    if (theme !== savedTheme) {
      const themeWantsDark = theme === "dark";
      if (themeWantsDark !== isDark) toggleTheme();
    }
    toast.success("Configuración guardada correctamente");
  };

  const handleReset = () => {
    setDays({ ...savedDays });
    setHours({ ...savedHours });
    setBookingCost(savedBookingCost);
    setTheme(savedTheme);
    setCodes([...savedCodes]);
    toast.info("Los cambios han sido revertidos");
  };

  const toggleHour = (day: DayKey, hour: string) => {
    const currentlyEnabled = hours[day]?.[hour]?.enabled ?? false;

    if (!currentlyEnabled && !days[day]) {
      setDays((prev) => ({ ...prev, [day]: true }));
    }

    const newHours = {
      ...hours,
      [day]: {
        ...(hours[day] ?? {}),
        [hour]: {
          ...(hours[day]?.[hour] ?? { enabled: false, maxBookings: 1 }),
          enabled: !currentlyEnabled,
        },
      },
    };

    // Si desactivamos una hora, verificar si quedaron todas desactivadas → desactivar el día
    if (currentlyEnabled) {
      const anyEnabled = Object.values(newHours[day]).some((h) => h.enabled);
      if (!anyEnabled) {
        setDays((prev) => ({ ...prev, [day]: false }));
      }
    }

    setHours(newHours);
  };

  const setHourMaxBookings = (day: DayKey, hour: string, delta: number) => {
    setHours((prev) => {
      const current = prev[day]?.[hour]?.maxBookings ?? 1;
      const clamped = Math.max(1, Math.min(10, current + delta));
      return {
        ...prev,
        [day]: {
          ...(prev[day] ?? {}),
          [hour]: {
            ...(prev[day]?.[hour] ?? { enabled: false, maxBookings: 1 }),
            maxBookings: clamped,
          },
        },
      };
    });
  };

  const handleAddCode = (code: DiscountCode) =>
    setCodes((prev) => [code, ...prev]);
  const handleDeleteCode = (id: string) =>
    setCodes((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col h-full max-md:pt-0">
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
        <div>
          <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
            Configuración
          </h1>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Administra los ajustes y preferencias del sistema de turnos.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && !hasFetched ? (
          <div className="px-7 py-10 flex items-center justify-center">
            <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
              Cargando configuración...
            </p>
          </div>
        ) : (
          <div className="px-7 py-5 max-md:px-0 max-md:py-0 flex flex-col gap-4 max-md:gap-0">
            <AvailableDays
              days={days}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
            <AvailableHours
              hours={hours}
              selectedDay={selectedDay}
              onToggle={toggleHour}
              onSetMax={setHourMaxBookings}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-md:gap-0">
              <BookingPrice value={bookingCost} onChange={setBookingCost} />
              <ThemeSwitcher theme={theme} onSelect={setTheme} />
            </div>
            <DiscountCodes
              codes={codes}
              onAdd={handleAddCode}
              onDelete={handleDeleteCode}
            />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-10 border-t border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 max-lg:px-4 h-17 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-content dark:text-zinc-100 truncate">
            {hasChanges ? (
              "Cambios sin guardar"
            ) : (
              <span>
                <span className="max-lg:hidden">
                  Todos los cambios están guardados
                </span>
                <span className="lg:hidden">Todo guardado</span>
              </span>
            )}
          </p>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5 max-lg:hidden">
            {hasChanges
              ? "Guardá la configuración para aplicar los cambios."
              : "Tu configuración está actualizada."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="max-lg:hidden">Restablecer</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="gap-1.5 bg-gold text-white hover:bg-gold/90 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="max-lg:hidden">
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </span>
            <span className="lg:hidden">{isSaving ? "..." : "Guardar"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
