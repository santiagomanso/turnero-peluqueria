"use server";

import { getProductCategoryCounts } from "@/services/shop";

export async function getCategoryCountsAction() {
  return await getProductCategoryCounts();
}
