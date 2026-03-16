import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export async function cancelAppointmentById(
  id: string,
): Promise<Appointment> {
  return db.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}

export async function deleteAppointmentsByPhone(
  telephone: string,
): Promise<{ count: number }> {
  return db.appointment.deleteMany({
    where: { telephone },
  });
}

export async function deletePastAppointments(): Promise<{ count: number }> {
  const now = new Date();

  return db.appointment.deleteMany({
    where: {
      date: {
        lt: now,
      },
    },
  });
}
