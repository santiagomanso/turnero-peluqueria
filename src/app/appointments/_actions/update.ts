"use server";

import { revalidatePath } from "next/cache";
import type { Appointment } from "@/types/appointment";
import { updateAppointment } from "@/services/update";

type UpdateAppointmentData = {
  id: string;
  date: Date;
  time: string;
  telephone: string;
};

export async function updateAppointmentAction(
  data: UpdateAppointmentData,
): Promise<{ success: boolean; data?: Appointment; error?: string }> {
  try {
    // Call service layer directly (validation happens in the hook)
    const appointment = await updateAppointment(data);

    // Revalidate paths
    revalidatePath("/appointments/search");
    revalidatePath(`/appointments/${data.id}`);

    return {
      success: true,
      data: appointment,
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      error: "Error al actualizar el turno. Por favor intenta nuevamente.",
    };
  }
}
