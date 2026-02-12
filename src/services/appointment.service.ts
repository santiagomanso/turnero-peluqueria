import { db } from "@/lib/db";

type CreateAppointmentInput = {
  date: Date;
  time: string;
  telephone: string;
};

export async function createAppointment(data: CreateAppointmentInput) {
  return db.appointment.create({
    data: {
      date: data.date,
      time: data.time,
      telephone: data.telephone,
    },
  });
}
