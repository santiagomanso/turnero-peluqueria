"use server";

import { updateOrderStatus } from "@/services/orders";
import type { OrderStatus } from "@/types/shop";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateOrderStatus(orderId, status);
    return { success: true };
  } catch (error) {
    console.error("updateOrderStatusAction error:", error);
    return { success: false, error: "Error al actualizar el estado" };
  }
}
