import { db } from "@/lib/db";
import type { Period, PeriodData } from "@/types/metrics";

export async function getMetrics(period: Period): Promise<PeriodData> {
  const now = new Date();
  const from = new Date(now);

  if (period === "week") from.setDate(now.getDate() - 7);
  else if (period === "month") from.setMonth(now.getMonth() - 1);
  else from.setFullYear(now.getFullYear() - 1);

  const appointments = await db.appointment.findMany({
    where: { date: { gte: from, lte: now } },
    select: { date: true, time: true, status: true, price: true },
  });

  const total = appointments.length;
  const paid = appointments.filter((a) => a.status === "PAID").length;
  const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;
  const revenue = appointments
    .filter((a) => a.status === "PAID")
    .reduce((acc, a) => acc + (a.price ?? 0), 0);

  // byDay
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const byDayMap: Record<string, number> = {};
  for (const a of appointments) {
    const label = dayNames[new Date(a.date).getDay()];
    byDayMap[label] = (byDayMap[label] ?? 0) + 1;
  }
  const byDay = dayNames.map((label) => ({
    label,
    turnos: byDayMap[label] ?? 0,
  }));

  // byHour
  const byHourMap: Record<string, number> = {};
  for (const a of appointments) {
    byHourMap[a.time] = (byHourMap[a.time] ?? 0) + 1;
  }
  const byHour = Object.entries(byHourMap)
    .map(([label, turnos]) => ({ label, turnos }))
    .sort((a, b) => b.turnos - a.turnos)
    .slice(0, 5);

  // growth: current period vs previous period
  const prevFrom = new Date(from);
  const prevTo = new Date(from);
  if (period === "week") prevFrom.setDate(prevFrom.getDate() - 7);
  else if (period === "month") prevFrom.setMonth(prevFrom.getMonth() - 1);
  else prevFrom.setFullYear(prevFrom.getFullYear() - 1);

  const prevAppointments = await db.appointment.findMany({
    where: { date: { gte: prevFrom, lte: prevTo } },
    select: { date: true, status: true },
  });

  const currentMap: Record<string, number> = {};
  const previousMap: Record<string, number> = {};

  const getLabel = (date: Date) =>
    period === "year"
      ? date.toLocaleString("es", { month: "short" })
      : `${date.getDate()}/${date.getMonth() + 1}`;

  for (const a of appointments) {
    const label = getLabel(new Date(a.date));
    currentMap[label] = (currentMap[label] ?? 0) + 1;
  }
  for (const a of prevAppointments) {
    const label = getLabel(new Date(a.date));
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
      totalDelta: 0,
      paid,
      paidDelta: 0,
      cancelled,
      cancelledDelta: 0,
      revenue: `$${revenue.toLocaleString("es-AR")}`,
      revenueDelta: 0,
    },
    byDay,
    byHour,
    growth,
  };
}
