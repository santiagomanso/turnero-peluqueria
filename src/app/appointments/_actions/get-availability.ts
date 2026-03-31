"use server";

import { getAppointmentsByDate } from "@/services/get";
import { getConfig } from "@/services/config";
import { DAYS } from "@/types/config";
import type { Hour, DayKey } from "@/types/config";

export type AvailableHour = {
  time: Hour;
  available: boolean;
};

const DAY_INDEX_TO_KEY: Record<number, DayKey> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export async function getAvailabilityAction(date: Date): Promise<{
  success: boolean;
  hours?: AvailableHour[];
  error?: string;
}> {
  try {
    const [config, appointments] = await Promise.all([
      getConfig(),
      getAppointmentsByDate(date),
    ]);

    if (!config) return { success: false, error: "Sin configuración." };

    const dayKey = DAY_INDEX_TO_KEY[date.getDay()];
    const dayHours = config.hours[dayKey] ?? {};

    const bookingsByHour = appointments
      .filter((a) => a.status !== "CANCELLED")
      .reduce<Record<string, number>>((acc, a) => {
        acc[a.time] = (acc[a.time] ?? 0) + 1;
        return acc;
      }, {});

    const hours: AvailableHour[] = (
      Object.entries(dayHours) as [
        Hour,
        { enabled: boolean; maxBookings: number },
      ][]
    )
      .filter(([, h]) => h.enabled)
      .map(([time, h]) => ({
        time,
        available: (bookingsByHour[time] ?? 0) < h.maxBookings,
      }))
      .sort((a, b) => a.time.localeCompare(b.time));

    return { success: true, hours };
  } catch (error) {
    console.error("Error getting availability:", error);
    return { success: false, error: "Error al obtener disponibilidad." };
  }
}
