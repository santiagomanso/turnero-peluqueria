import { db } from "@/lib/db";
import { formatArgentinianPhone } from "@/lib/format-phone";
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
  const { id, date, time, telephone } = data;

  return db.appointment.update({
    where: { id },
    data: {
      ...(date && { date }),
      ...(time && { time }),
      ...(telephone && { telephone: formatArgentinianPhone(telephone) }),
    },
  });
}
