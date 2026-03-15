import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

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
  const day = new Date(specificDate + "T12:00:00.000Z");

  const payments = await db.payment.findMany({
    where: {
      paidAt: { gte: startOfDay(day), lt: endOfDay(day) },
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
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  const payments = await db.payment.findMany({
    where: { paidAt: { gte: startDate, lt: endDate } },
    select: { paidAt: true },
  });

  const counts: Record<string, number> = {};
  for (const p of payments) {
    const key = p.paidAt.toISOString().split("T")[0];
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}
