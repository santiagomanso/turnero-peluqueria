"use server";

import {
  getDashboardSummary,
  type DashboardSummary,
} from "@/services/dashboard";

export async function getDashboardAction(): Promise<DashboardSummary> {
  return getDashboardSummary();
}
