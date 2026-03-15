"use server";

import {
  getUnifiedPayments,
  getPaymentMonthlyCounts,
  type UnifiedPaymentRow,
} from "@/services/payments";

export type { UnifiedPaymentRow };

export async function getUnifiedPaymentsAction(
  specificDate: string, // YYYY-MM-DD
): Promise<
  { success: true; data: UnifiedPaymentRow[] } | { success: false; error: string }
> {
  try {
    const data = await getUnifiedPayments(specificDate);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { success: false, error: "Error al obtener los pagos" };
  }
}

export async function getPaymentMonthlyCountsAction(
  year: number,
  month: number, // 0-indexed (JS convention)
): Promise<
  { success: true; data: Record<string, number> } | { success: false; error: string }
> {
  try {
    const data = await getPaymentMonthlyCounts(year, month);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching payment monthly counts:", error);
    return { success: false, error: "Error al obtener los conteos" };
  }
}
