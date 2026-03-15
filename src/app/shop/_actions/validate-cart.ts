"use server";

import {
  validateCart,
  type CartValidationItem,
  type CartValidationResult,
} from "@/services/orders";

export async function validateCartAction(
  items: CartValidationItem[],
): Promise<CartValidationResult> {
  return validateCart(items);
}
