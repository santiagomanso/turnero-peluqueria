"use server";

import { getMonthlyAppointmentCounts } from "@/services/get";

export async function getMonthlyAppointmentCountsAction(
  year: number,
  month: number, // 0-indexed
): Promise<Record<string, number>> {
  return getMonthlyAppointmentCounts(year, month);
}
