import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";
import { formatDateISO } from "@/lib/format-date";

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
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth(); // ya 0-indexed
  const d = date.getUTCDate();

  const start = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, d, 23, 59, 59, 999));

  return db.appointment.findMany({
    where: {
      date: { gte: start, lte: end },
    },
    orderBy: { time: "asc" },
  });
}
