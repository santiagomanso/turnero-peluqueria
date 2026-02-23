"use server";

import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

type CreatePreferencePayload = {
  date: string; // "2026-02-26"
  hour: string; // "10:00"
  telephone: string;
};

export async function createPaymentPreferenceAction(
  data: CreatePreferencePayload,
) {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: "turno",
            title: `Luckete Colorista - Turno ${data.date.split("-").reverse().join("-")} - ${data.hour}`,
            quantity: 1,
            unit_price: 20,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new?date=${data.date}&hour=${encodeURIComponent(data.hour)}&telephone=${encodeURIComponent(data.telephone)}&status=approved`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new?status=pending`,
        },
        auto_return: "approved",
      },
    });

    return { success: true, initPoint: result.init_point };
  } catch (error) {
    console.error("Error creating MP preference:", error);
    return { success: false, error: "No se pudo iniciar el pago." };
  }
}
