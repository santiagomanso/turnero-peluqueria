"use server";

import { getAppointmentById } from "@/services/get";
import type { Appointment } from "@/types/appointment";

export async function getAppointmentByIdAction(
  id: string,
): Promise<{ success: boolean; data?: Appointment; error?: string }> {
  try {
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      return {
        success: false,
        error: "Turno no encontrado",
      };
    }

    return {
      success: true,
      data: appointment,
    };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      success: false,
      error: "Error al buscar el turno",
    };
  }
}
