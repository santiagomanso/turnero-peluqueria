"use server";

import MercadoPagoConfig, { Preference } from "mercadopago";
import type { Order } from "@/types/shop";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function createShopPreferenceAction(order: Order) {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: order.items.map((item) => ({
          id: `producto-${item.productId}`,
          title: item.productName,
          description: `${item.productCategory} — Luckete Colorista`,
          category_id: "others",
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: "ARS",
        })),
        statement_descriptor: "LUCKETE COLORISTA",
        external_reference: `order:${order.id}`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/shop/checkout/success?orderId=${order.id}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/shop/checkout?status=failure&orderId=${order.id}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/shop/checkout?status=pending&orderId=${order.id}`,
        },
        auto_return: "approved",
      },
    });

    return { success: true as const, initPoint: result.init_point! };
  } catch (error) {
    console.error("Error creating shop MP preference:", error);
    return { success: false as const, error: "No se pudo iniciar el pago." };
  }
}
