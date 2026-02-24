"use server";

import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

type CreatePreferencePayload = {
  date: string;
  hour: string;
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
            id: `turno-${data.date}-${data.hour}`,
            title: "Luckete Colorista",
            quantity: 1,
            unit_price: 1,
            currency_id: "ARS",
            picture_url: "https://i.ibb.co/hFZ6ctBz/logo.png",
          },
        ],
        external_reference: JSON.stringify({
          date: data.date,
          hour: data.hour,
          telephone: data.telephone,
        }),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new?status=pending`,
        },
        auto_return: "approved",
      },
    });
    console.log(
      "back_urls.success:",
      `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new/success`,
    );
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    return { success: true, initPoint: result.init_point };
  } catch (error) {
    console.error("Error creating MP preference:", error);
    return { success: false, error: "No se pudo iniciar el pago." };
  }
}
