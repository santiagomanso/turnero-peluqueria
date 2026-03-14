"use server";

import { getPayments, getPaymentMonthlyCounts } from "@/services/payments";

export type PaymentRow = {
  id: string;
  mercadopagoId: string;
  amount: number;
  status: string;
  createdAt: string; // ISO string — safe for client serialization
  appointment: {
    id: string;
    payerName: string | null;
    payerEmail: string | null;
    telephone: string;
    date: string; // ISO string
    time: string;
  };
};

export async function getPaymentsAction(
  specificDate: string, // YYYY-MM-DD
): Promise<{ success: true; data: PaymentRow[] } | { success: false; error: string }> {
  try {
    const data = await getPayments(specificDate);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { success: false, error: "Error al obtener los pagos" };
  }
}

export async function getPaymentMonthlyCountsAction(
  year: number,
  month: number, // 0-indexed (JS convention)
): Promise<{ success: true; data: Record<string, number> } | { success: false; error: string }> {
  try {
    const data = await getPaymentMonthlyCounts(year, month);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching payment monthly counts:", error);
    return { success: false, error: "Error al obtener los conteos" };
  }
}
