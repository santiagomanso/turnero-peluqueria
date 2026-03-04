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
  id: string,
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

export async function getAppointmentsByDate(
  date: Date,
): Promise<Appointment[]> {
  // Las fechas se guardan como UTC midnight (ej: 2026-02-27T00:00:00Z)
  // así que el rango UTC 00:00 → 23:59 del mismo día es correcto
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return db.appointment.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      time: "asc",
    },
  });
}
