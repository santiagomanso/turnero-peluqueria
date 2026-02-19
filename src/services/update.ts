import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export type UpdateAppointmentInput = {
  id: string;
  date?: Date;
  time?: string;
  telephone?: string;
};

export async function updateAppointment(
  data: UpdateAppointmentInput,
): Promise<Appointment> {
  const { id, ...updateData } = data;

  return db.appointment.update({
    where: { id },
    data: updateData,
  });
}
