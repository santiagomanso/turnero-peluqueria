"use server";

import { db } from "@/lib/db";
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

    // Fetch appointments from database
    const appointments = await db.appointment.findMany({
      where: {
        telephone: telephone,
      },
      orderBy: {
        date: "asc",
      },
    });

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
