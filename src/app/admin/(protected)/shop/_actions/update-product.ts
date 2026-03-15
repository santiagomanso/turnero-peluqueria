"use server";

import { toggleProductActive, updateProduct } from "@/services/shop";
import type { Product } from "@/types/shop";

export async function updateProductAction(
  id: string,
  input: Partial<{
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category: string;
    imageUrl: string | null;
    active: boolean;
    featured: boolean;
  }>,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const product = await updateProduct(id, input);
    return { success: true, product };
  } catch (error) {
    console.error("updateProductAction error:", error);
    return { success: false, error: "Error al actualizar el producto" };
  }
}

export async function toggleProductActiveAction(
  id: string,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const product = await toggleProductActive(id);
    return { success: true, product };
  } catch (error) {
    console.error("toggleProductActiveAction error:", error);
    return { success: false, error: "Error al cambiar el estado del producto" };
  }
}
