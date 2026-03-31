"use server";

import { createOrder, type CreateOrderInput } from "@/services/orders";

export async function createOrderAction(input: CreateOrderInput) {
  try {
    const order = await createOrder(input);
    return { success: true as const, order };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear la orden.";
    return { success: false as const, error: message };
  }
}
