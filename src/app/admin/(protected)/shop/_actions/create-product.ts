"use server";

import { createProduct } from "@/services/shop";
import type { Product } from "@/types/shop";

export async function createProductAction(input: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  active: boolean;
  featured?: boolean;
}): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const product = await createProduct(input);
    return { success: true, product };
  } catch (error) {
    console.error("createProductAction error:", error);
    return { success: false, error: "Error al crear el producto" };
  }
}
