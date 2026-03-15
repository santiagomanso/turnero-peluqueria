"use server";

import { getOrders, getOrderById } from "@/services/orders";
import type { Order } from "@/types/shop";

export async function getOrdersAction(): Promise<{
  success: boolean;
  orders?: Order[];
  error?: string;
}> {
  try {
    const orders = await getOrders();
    return { success: true, orders };
  } catch (error) {
    console.error("getOrdersAction error:", error);
    return { success: false, error: "Error al obtener las órdenes" };
  }
}

export async function getOrderByIdAction(
  id: string,
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const order = await getOrderById(id);
    if (!order) return { success: false, error: "Orden no encontrada" };
    return { success: true, order };
  } catch (error) {
    console.error("getOrderByIdAction error:", error);
    return { success: false, error: "Error al obtener la orden" };
  }
}
