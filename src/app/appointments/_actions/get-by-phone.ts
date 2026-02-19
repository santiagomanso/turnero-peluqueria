"use server";

import { getAppointmentsByPhone } from "@/services/get";
import type { Appointment } from "@/types/appointment";

export async function getAppointmentsByPhoneAction(
  telephone: string,
): Promise<{ success: boolean; data?: Appointment[]; error?: string }> {
  try {
    // Validate phone number
    if (!telephone || telephone.length < 9) {
      return {
        success: false,
        error: "Número de teléfono inválido",
      };
    }

    // Call service layer (NOT the action itself!)
    const appointments = await getAppointmentsByPhone(telephone);

    return {
      success: true,
      data: appointments,
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return {
      success: false,
      error: "Error al buscar turnos. Por favor intenta nuevamente.",
    };
  }
}
