import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export async function deleteAppointmentById(id: string): Promise<Appointment> {
  // Changed from number
  return db.appointment.delete({
    where: { id },
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
