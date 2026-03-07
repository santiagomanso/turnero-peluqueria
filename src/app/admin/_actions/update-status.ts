"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { AppointmentStatus } from "@prisma/client";

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.appointment.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}
