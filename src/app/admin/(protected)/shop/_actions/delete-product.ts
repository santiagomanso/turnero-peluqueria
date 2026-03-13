"use server";

import { deleteProduct } from "@/services/shop";

export async function deleteProductAction(
  productId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteProduct(productId);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al eliminar el producto";
    console.error("deleteProductAction error:", error);
    return { success: false, error: message };
  }
}
