"use server";

import MercadoPagoConfig, { Preference } from "mercadopago";
import { db } from "@/lib/db";
import { createAppointment } from "@/services/create";
import { getConfig } from "@/services/config";
import { getAppointmentsByDate } from "@/services/get";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

type CreatePreferencePayload = {
  date: string;
  hour: string;
  telephone: string;
  discountCode: string | null;
};

export async function createPaymentPreferenceAction(
  data: CreatePreferencePayload,
) {
  try {
    const [year, month, day] = data.date.split("-").map(Number);
    const appointmentDate = new Date(
      Date.UTC(year, month - 1, day, 0, 0, 0, 0),
    );

    const config = await getConfig();
    if (!config) throw new Error("No se pudo leer la configuración.");

    // Verificar disponibilidad real en DB antes de crear
    const dayKeyMap: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    const dayKey = dayKeyMap[
      appointmentDate.getUTCDay()
    ] as keyof typeof config.hours;
    const hourConfig = config.hours[dayKey]?.[data.hour];

    if (!hourConfig?.enabled) {
      return { success: false, error: "Este horario no está disponible." };
    }

    const appointments = await getAppointmentsByDate(appointmentDate);
    const activeBookings = appointments.filter(
      (a) => a.status !== "CANCELLED" && a.time === data.hour,
    ).length;

    if (activeBookings >= hourConfig.maxBookings) {
      return {
        success: false,
        error: "Este horario se acaba de completar. Por favor elegí otro.",
        hourFull: true,
      };
    }

    const basePrice = config.bookingCost;
    let finalPrice = basePrice;
    if (data.discountCode) {
      const found = config.discountCodes.find(
        (c) => c.code.toUpperCase() === data.discountCode!.toUpperCase(),
      );
      if (found) {
        finalPrice = Math.round(basePrice * (1 - found.discount / 100));
      }
    }

    const appointment = await createAppointment({
      date: appointmentDate,
      time: data.hour,
      telephone: data.telephone,
      price: finalPrice,
    });

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
            unit_price: finalPrice,
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

    if (result.init_point) {
      await db.appointment.update({
        where: { id: appointment.id },
        data: { paymentUrl: result.init_point },
      });
    }

    return { success: true, initPoint: result.init_point };
  } catch (error) {
    console.error("Error creating MP preference:", error);
    return { success: false, error: "No se pudo iniciar el pago." };
  }
}
