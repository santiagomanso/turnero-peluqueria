"use server";

import { createAppointment } from "@/services/appointment.service";

type CreateAppointmentPayload = {
  date: Date;
  time: string;
  telephone: string;
};

export async function createAppointmentAction(data: CreateAppointmentPayload) {
  try {
    const appointment = await createAppointment(data);

    return {
      success: true,
      appointment,
    };
  } catch (error) {
    console.error("Error creating appointment:", error);

    return {
      success: false,
      error: "No se pudo crear el turno.",
    };
  }
}
