"use server";

import { getProducts } from "@/services/shop";
import type { Product } from "@/types/shop";

export async function getProductsAction(): Promise<{
  success: boolean;
  products?: Product[];
  error?: string;
}> {
  try {
    const products = await getProducts();
    return { success: true, products };
  } catch (error) {
    console.error("getProductsAction error:", error);
    return { success: false, error: "Error al obtener los productos" };
  }
}
