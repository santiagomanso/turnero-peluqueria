import MercadoPagoConfig, { Preference } from "mercadopago";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

/**
 * Creates a new MP preference for an existing PENDING appointment,
 * stores the init_point in the appointment, and returns the URL.
 */
export async function regeneratePaymentLink(
  appointmentId: string,
): Promise<{ paymentUrl: string }> {
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) throw new Error("Turno no encontrado.");
  if (appointment.status !== "PENDING") {
    throw new Error("Solo se puede generar link para turnos pendientes.");
  }

  const dateStr = format(appointment.date, "yyyy-MM-dd", { locale: es });

  const preference = new Preference(client);
  const result = await preference.create({
    body: {
      items: [
        {
          id: `turno-${dateStr}-${appointment.time}`,
          title: "Turno",
          description: "Luckete Colorista",
          category_id: "services",
          quantity: 1,
          unit_price: appointment.price,
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

  const paymentUrl = result.init_point;
  if (!paymentUrl) throw new Error("MercadoPago no devolvió un link de pago.");

  await db.appointment.update({
    where: { id: appointmentId },
    data: { paymentUrl },
  });

  return { paymentUrl };
}
