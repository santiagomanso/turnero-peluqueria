"use server";

import { getProductById } from "@/services/shop";
import type { Product } from "@/types/shop";

export async function getProductByIdAction(
  id: string,
): Promise<Product | null> {
  return await getProductById(id);
}
