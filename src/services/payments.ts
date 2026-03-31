import { db } from "@/lib/db";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const TZ = "America/Argentina/Buenos_Aires";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UnifiedPaymentRow = {
  id: string;
  type: "appointment" | "shop_order";
  source: "mercadopago" | "cash" | "transfer";
  amount: number;
  status: string;
  mercadopagoId: string | null;
  paidAt: string; // ISO string
  customerName: string | null;
  customerPhone: string;
  // appointment-specific
  appointmentId?: string;
  appointmentDate?: string; // ISO string
  appointmentTime?: string;
  // order-specific
  orderId?: string;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetches all payments (appointments + shop orders) for a given day.
 * specificDate must be a YYYY-MM-DD string.
 */
export async function getUnifiedPayments(
  specificDate: string,
): Promise<UnifiedPaymentRow[]> {
  // Use Argentina timezone for day boundaries so the list view matches the heatmap
  const dayStart = fromZonedTime(`${specificDate}T00:00:00`, TZ);
  const dayEnd = fromZonedTime(`${specificDate}T23:59:59.999`, TZ);

  const payments = await db.payment.findMany({
    where: {
      paidAt: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { paidAt: "desc" },
    include: {
      appointment: {
        select: {
          payerName: true,
          payerEmail: true,
          telephone: true,
          date: true,
          time: true,
        },
      },
      order: {
        select: {
          id: true,
          name: true,
          telephone: true,
        },
      },
    },
  });

  return payments.map((p) => {
    if (p.type === "appointment" && p.appointment) {
      return {
        id: p.id,
        type: "appointment" as const,
        source: p.source as UnifiedPaymentRow["source"],
        amount: p.amount,
        status: p.status,
        mercadopagoId: p.mercadopagoId,
        paidAt: p.paidAt.toISOString(),
        customerName: p.appointment.payerName ?? p.appointment.payerEmail,
        customerPhone: p.appointment.telephone,
        appointmentId: p.appointmentId ?? undefined,
        appointmentDate: p.appointment.date.toISOString(),
        appointmentTime: p.appointment.time,
      };
    }

    return {
      id: p.id,
      type: "shop_order" as const,
      source: p.source as UnifiedPaymentRow["source"],
      amount: p.amount,
      status: p.status,
      mercadopagoId: p.mercadopagoId,
      paidAt: p.paidAt.toISOString(),
      customerName: p.order?.name ?? null,
      customerPhone: p.order?.telephone ?? "",
      orderId: p.order?.id,
    };
  });
}

/**
 * Returns payment counts per day for a given month.
 * Keys are "YYYY-MM-DD" strings; values are the number of payments that day.
 */
export async function getPaymentMonthlyCounts(
  year: number,
  month: number, // 0-indexed (JS convention)
): Promise<Record<string, number>> {
  const monthStr = String(month + 1).padStart(2, "0");
  const nextMonth = month + 1 > 11 ? 1 : month + 2;
  const nextYear = month + 1 > 11 ? year + 1 : year;
  const nextMonthStr = String(nextMonth).padStart(2, "0");

  const startDate = fromZonedTime(`${year}-${monthStr}-01T00:00:00`, TZ);
  const endDate = fromZonedTime(`${nextYear}-${nextMonthStr}-01T00:00:00`, TZ);

  const payments = await db.payment.findMany({
    where: { paidAt: { gte: startDate, lt: endDate } },
    select: { paidAt: true },
  });

  const counts: Record<string, number> = {};
  for (const p of payments) {
    const key = formatInTimeZone(p.paidAt, TZ, "yyyy-MM-dd");
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}
