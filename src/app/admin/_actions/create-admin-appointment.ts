"use server";

import { revalidatePath } from "next/cache";
import { createAppointment } from "@/services/create";

type CreateAdminAppointmentInput = {
  date: Date;
  time: string;
  telephone: string;
};

export async function createAdminAppointmentAction(
  data: CreateAdminAppointmentInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const [year, month, day] = [
      data.date.getFullYear(),
      data.date.getMonth(),
      data.date.getDate(),
    ];
    const appointmentDate = new Date(year, month, day, 0, 0, 0, 0);

    await createAppointment({
      date: appointmentDate,
      time: data.time,
      telephone: data.telephone,
    });

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error creating admin appointment:", error);
    return { success: false, error: "No se pudo crear el turno." };
  }
}
