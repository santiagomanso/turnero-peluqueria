import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export type CreateAppointmentInput = {
  date: Date;
  time: string;
  telephone: string;
};

export async function createAppointment(
  data: CreateAppointmentInput,
): Promise<Appointment> {
  // Prisma will auto-generate the cuid
  return db.appointment.create({
    data: {
      date: data.date,
      time: data.time,
      telephone: data.telephone,
    },
  });
}
