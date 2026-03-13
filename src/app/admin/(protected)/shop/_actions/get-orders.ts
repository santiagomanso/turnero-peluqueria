"use server";

import { getOrders } from "@/services/orders";
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
