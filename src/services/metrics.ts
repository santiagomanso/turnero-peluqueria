import { db } from "@/lib/db";
import type { Period, PeriodData } from "@/types/metrics";

function calcDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function getUTCDay(date: Date): number {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
      0,
    ),
  ).getUTCDay();
}

function getUTCLabel(date: Date, period: Period): string {
  const d = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
      0,
    ),
  );
  if (period === "year") {
    return d.toLocaleString("es", { month: "short", timeZone: "UTC" });
  }
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}

export async function getMetrics(period: Period): Promise<PeriodData> {
  const now = new Date();
  const from = new Date(now);

  if (period === "week") from.setDate(now.getDate() - 7);
  else if (period === "month") from.setMonth(now.getMonth() - 1);
  else from.setFullYear(now.getFullYear() - 1);

  const prevFrom = new Date(from);
  if (period === "week") prevFrom.setDate(prevFrom.getDate() - 7);
  else if (period === "month") prevFrom.setMonth(prevFrom.getMonth() - 1);
  else prevFrom.setFullYear(prevFrom.getFullYear() - 1);

  const [appointments, prevAppointments] = await Promise.all([
    db.appointment.findMany({
      where: { date: { gte: from } },
      select: { date: true, time: true, status: true, price: true },
    }),
    db.appointment.findMany({
      where: { date: { gte: prevFrom, lte: from } },
      select: { date: true, status: true, price: true },
    }),
  ]);

  const total = appointments.length;
  const paid = appointments.filter((a) => a.status === "PAID").length;
  const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;
  const revenue = appointments
    .filter((a) => a.status === "PAID")
    .reduce((acc, a) => acc + (a.price ?? 0), 0);

  const prevTotal = prevAppointments.length;
  const prevPaid = prevAppointments.filter((a) => a.status === "PAID").length;
  const prevCancelled = prevAppointments.filter(
    (a) => a.status === "CANCELLED",
  ).length;
  const prevRevenue = prevAppointments
    .filter((a) => a.status === "PAID")
    .reduce((acc, a) => acc + (a.price ?? 0), 0);

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const byDayMap: Record<string, number> = {};
  for (const a of appointments) {
    const label = dayNames[getUTCDay(a.date)];
    byDayMap[label] = (byDayMap[label] ?? 0) + 1;
  }
  const byDay = dayNames.map((label) => ({
    label,
    turnos: byDayMap[label] ?? 0,
  }));

  const byHourMap: Record<string, number> = {};
  for (const a of appointments) {
    byHourMap[a.time] = (byHourMap[a.time] ?? 0) + 1;
  }
  const byHour = Object.entries(byHourMap)
    .map(([label, turnos]) => ({ label, turnos }))
    .sort((a, b) => b.turnos - a.turnos)
    .slice(0, 5);

  const currentMap: Record<string, number> = {};
  const previousMap: Record<string, number> = {};

  for (const a of appointments) {
    const label = getUTCLabel(a.date, period);
    currentMap[label] = (currentMap[label] ?? 0) + 1;
  }
  for (const a of prevAppointments) {
    const label = getUTCLabel(a.date, period);
    previousMap[label] = (previousMap[label] ?? 0) + 1;
  }

  const allLabels = Array.from(
    new Set([...Object.keys(currentMap), ...Object.keys(previousMap)]),
  );
  const growth = allLabels.map((label) => ({
    label,
    current: currentMap[label] ?? 0,
    previous: previousMap[label] ?? 0,
  }));

  return {
    stats: {
      total,
      totalDelta: calcDelta(total, prevTotal),
      paid,
      paidDelta: calcDelta(paid, prevPaid),
      cancelled,
      cancelledDelta: calcDelta(cancelled, prevCancelled),
      revenue: `$${revenue.toLocaleString("es-AR")}`,
      revenueDelta: calcDelta(revenue, prevRevenue),
    },
    byDay,
    byHour,
    growth,
  };
}
