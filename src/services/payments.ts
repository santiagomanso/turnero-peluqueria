import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import type { PaymentRow } from "@/app/admin/_actions/get-payments";

/**
 * Fetches all payments for a given day.
 * specificDate must be a YYYY-MM-DD string.
 */
export async function getPayments(specificDate: string): Promise<PaymentRow[]> {
  const day = new Date(specificDate + "T12:00:00.000Z"); // noon UTC avoids day-boundary issues

  const payments = await db.payment.findMany({
    where: { createdAt: { gte: startOfDay(day), lt: endOfDay(day) } },
    orderBy: { createdAt: "desc" },
    include: {
      appointment: {
        select: {
          id: true,
          payerName: true,
          payerEmail: true,
          telephone: true,
          date: true,
          time: true,
        },
      },
    },
  });

  return payments.map((p) => ({
    id: p.id,
    mercadopagoId: p.mercadopagoId,
    amount: p.amount,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    appointment: {
      id: p.appointment.id,
      payerName: p.appointment.payerName,
      payerEmail: p.appointment.payerEmail,
      telephone: p.appointment.telephone,
      date: p.appointment.date.toISOString(),
      time: p.appointment.time,
    },
  }));
}

/**
 * Returns payment counts per day for a given month.
 * Keys are "YYYY-MM-DD" strings; values are the number of payments that day.
 */
export async function getPaymentMonthlyCounts(
  year: number,
  month: number, // 0-indexed (JS convention)
): Promise<Record<string, number>> {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const payments = await db.payment.findMany({
    where: { createdAt: { gte: startDate, lt: endDate } },
    select: { createdAt: true },
  });

  const counts: Record<string, number> = {};
  for (const p of payments) {
    const key = p.createdAt.toISOString().split("T")[0];
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}
