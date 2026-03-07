"use server";

import MercadoPagoConfig, { Preference } from "mercadopago";
import { createAppointment } from "@/services/create";
import { getConfig } from "@/services/config";

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
    // 1. Leer precio actual de la config
    const config = await getConfig();
    if (!config) throw new Error("No se pudo leer la configuración.");
    const price = config.bookingCost;

    // 2. Crear appointment PENDING con snapshot del precio
    const [year, month, day] = data.date.split("-").map(Number);
    const appointmentDate = new Date(year, month - 1, day, 0, 0, 0, 0);

    const appointment = await createAppointment({
      date: appointmentDate,
      time: data.hour,
      telephone: data.telephone,
      price,
    });

    // 3. Crear preference en MP con el precio real
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `turno-${data.date}-${data.hour}`,
            title: "Turno",
            description: "Luckete Colorista",
            category_id: "services",
            quantity: 1,
            unit_price: price,
            currency_id: "ARS",
            picture_url: "https://i.ibb.co/hFZ6ctBz/logo.png",
          },
        ],
        statement_descriptor: "LUCKETE COLORISTA",
        external_reference: appointment.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/appointments/new/success`,
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
