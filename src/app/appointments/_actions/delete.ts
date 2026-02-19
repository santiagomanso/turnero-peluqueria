"use server";

import { revalidatePath } from "next/cache";
import type { Appointment } from "@/types/appointment";
import { deleteAppointmentById } from "@/services/delete";

export async function deleteAppointmentAction(
  id: string,
): Promise<{ success: boolean; data?: Appointment; error?: string }> {
  try {
    const appointment = await deleteAppointmentById(id);

    // Revalidate the search page
    revalidatePath("/appointments/search");

    return {
      success: true,
      data: appointment,
    };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      error: "Error al cancelar el turno. Por favor intenta nuevamente.",
    };
  }
}
