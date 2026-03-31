import { db } from "@/lib/db";
import { formatInTimeZone } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";

export interface DashboardSummary {
  todayAppointments: number;
  nextAppointment: { time: string; clientName: string } | null;
  pendingOrders: number;
  todayRevenue: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const todayISO = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
  const todayStart = new Date(todayISO + "T00:00:00.000Z");
  const todayEnd = new Date(todayISO + "T23:59:59.999Z");

  const [appointments, pendingOrders, payments] = await Promise.all([
    db.appointment.findMany({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: { in: ["PENDING", "PAID"] },
      },
      select: { time: true, payerName: true },
      orderBy: { time: "asc" },
    }),
    db.order.count({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
    }),
    db.payment.findMany({
      where: { paidAt: { gte: todayStart, lte: todayEnd } },
      select: { amount: true },
    }),
  ]);

  const nowTime = formatInTimeZone(new Date(), TZ, "HH:mm");
  const upcoming = appointments.find((a) => a.time >= nowTime);

  return {
    todayAppointments: appointments.length,
    nextAppointment: upcoming
      ? { time: upcoming.time, clientName: upcoming.payerName ?? "Cliente" }
      : null,
    pendingOrders,
    todayRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
  };
}
