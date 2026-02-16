import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export type UpdateAppointmentInput = {
  id: number;
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

export async function rescheduleAppointment(
  id: number,
  date: Date,
  time: string,
): Promise<Appointment> {
  return db.appointment.update({
    where: { id },
    data: {
      date,
      time,
    },
  });
}

export async function updateAppointmentPhone(
  id: number,
  telephone: string,
): Promise<Appointment> {
  return db.appointment.update({
    where: { id },
    data: {
      telephone,
    },
  });
}
