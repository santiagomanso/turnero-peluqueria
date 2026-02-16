import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export async function getAppointmentsByPhone(
  telephone: string,
): Promise<Appointment[]> {
  return db.appointment.findMany({
    where: {
      telephone,
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getAppointmentById(
  id: number,
): Promise<Appointment | null> {
  return db.appointment.findUnique({
    where: { id },
  });
}

export async function getAllAppointments(): Promise<Appointment[]> {
  return db.appointment.findMany({
    orderBy: {
      date: "asc",
    },
  });
}

export async function getUpcomingAppointments(): Promise<Appointment[]> {
  const now = new Date();

  return db.appointment.findMany({
    where: {
      date: {
        gte: now,
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function getPastAppointments(): Promise<Appointment[]> {
  const now = new Date();

  return db.appointment.findMany({
    where: {
      date: {
        lt: now,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}
