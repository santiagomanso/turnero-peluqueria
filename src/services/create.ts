import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export type CreateAppointmentInput = {
  date: Date;
  time: string;
  telephone: string;
  paymentId?: string;
};

function normalizeArgentinePhone(telephone: string): string {
  const digits = telephone.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  return `549${digits}`;
}

export async function createAppointment(
  data: CreateAppointmentInput,
): Promise<Appointment> {
  return db.appointment.create({
    data: {
      date: data.date,
      time: data.time,
      telephone: normalizeArgentinePhone(data.telephone),
      paymentId: data.paymentId,
      status: "PENDING",
    },
  });
}
