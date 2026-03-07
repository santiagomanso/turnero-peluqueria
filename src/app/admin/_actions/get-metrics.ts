"use server";

import { getMetrics } from "@/services/metrics";
import type { Period, PeriodData } from "@/types/metrics";

export async function getMetricsAction(
  period: Period,
): Promise<
  { success: true; data: PeriodData } | { success: false; error: string }
> {
  try {
    const data = await getMetrics(period);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return { success: false, error: "Error al obtener métricas" };
  }
}
