"use server";

import { searchAppointments } from "@/services/get";
import type { Appointment } from "@/types/appointment";

export async function searchAppointmentsAction(
  query: string,
): Promise<
  { success: true; data: Appointment[] } | { success: false; error: string }
> {
  try {
    const data = await searchAppointments(query);
    return { success: true, data };
  } catch {
    return { success: false, error: "Error al buscar turnos" };
  }
}
