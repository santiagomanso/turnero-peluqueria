import { db } from "@/lib/db";
import { formatArgentinianPhone } from "@/lib/format-phone";
import type { Appointment } from "@/types/appointment";

export type CreateAppointmentInput = {
  date: Date;
  time: string;
  telephone: string;
  price: number;
};

export async function createAppointment(
  data: CreateAppointmentInput,
): Promise<Appointment> {
  return db.appointment.create({
    data: {
      date: data.date,
      time: data.time,
      telephone: formatArgentinianPhone(data.telephone),
      price: data.price,
      status: "PENDING",
    },
  });
}
