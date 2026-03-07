"use client";

import * as React from "react";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveConfigAction } from "@/app/admin/_actions/save-config";
import type {
  DayKey,
  DaysConfig,
  Hour,
  HoursConfig,
  DiscountCode,
} from "@/types/config";

import { AvailableDays } from "./available-days";
import { AvailableHours } from "./available-hours";
import { BookingPrice } from "./booking-price";
import { ThemeSwitcher } from "./theme-switcher";
import { DiscountCodes } from "./discount-codes";
import { useAdminTheme } from "@/app/admin/_components/admin-theme-provider";
import { useConfigStore } from "../_hooks/use-config-store";

const DEFAULT_DAYS: DaysConfig = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};
const DEFAULT_HOURS: HoursConfig = {
  "08:00": { enabled: true, maxBookings: 1 },
  "09:00": { enabled: true, maxBookings: 1 },
  "10:00": { enabled: true, maxBookings: 1 },
  "11:00": { enabled: true, maxBookings: 1 },
  "12:00": { enabled: true, maxBookings: 1 },
  "13:00": { enabled: true, maxBookings: 1 },
  "14:00": { enabled: true, maxBookings: 1 },
  "15:00": { enabled: true, maxBookings: 1 },
  "16:00": { enabled: true, maxBookings: 1 },
  "17:00": { enabled: true, maxBookings: 1 },
  "18:00": { enabled: false, maxBookings: 1 },
  "19:00": { enabled: false, maxBookings: 1 },
};

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

  // Sync local state when store loads for the first time
  const didSyncRef = React.useRef(false);
  React.useEffect(() => {
    if (hasFetched && storedConfig && !didSyncRef.current) {
      didSyncRef.current = true;
      const bc = String(storedConfig.bookingCost);
      setDays(storedConfig.days);
      setSavedDays(storedConfig.days);
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

  const toggleDay = (day: DayKey) =>
    setDays((prev) => ({ ...prev, [day]: !prev[day] }));
  const toggleHour = (hour: Hour) =>
    setHours((prev) => ({
      ...prev,
      [hour]: { ...prev[hour], enabled: !prev[hour].enabled },
    }));
  const setHourMaxBookings = (hour: Hour, value: number) => {
    const clamped = Math.max(1, Math.min(10, value));
    setHours((prev) => ({
      ...prev,
      [hour]: { ...prev[hour], maxBookings: clamped },
    }));
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
            <AvailableDays days={days} onToggle={toggleDay} />
            <AvailableHours
              hours={hours}
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
