"use server";

import { getAppointmentsByDate } from "@/services/get";
import type { Appointment } from "@/types/appointment";

export async function getAppointmentsByDateAction(
  date: Date,
): Promise<
  { success: true; data: Appointment[] } | { success: false; error: string }
> {
  try {
    const data = await getAppointmentsByDate(date);
    return { success: true, data };
  } catch {
    return { success: false, error: "Error al obtener los turnos" };
  }
}
