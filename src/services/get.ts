import { db } from "@/lib/db";
import type { Appointment } from "@/types/appointment";

export async function getAppointmentsByPhone(
  telephone: string,
): Promise<Appointment[]> {
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

  return db.appointment.findMany({
    where: {
      telephone,
      status: { not: "CANCELLED" },
      date: { gte: todayUTC },
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
  const m = date.getUTCMonth();
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

export async function getMonthlyAppointmentCounts(
  year: number,
  month: number,
): Promise<Record<string, number>> {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));

  const appointments = await db.appointment.findMany({
    where: {
      date: { gte: start, lt: end },
      status: { not: "CANCELLED" },
    },
    select: { date: true },
  });

  const counts: Record<string, number> = {};
  for (const a of appointments) {
    const key = a.date.toISOString().split("T")[0];
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}
