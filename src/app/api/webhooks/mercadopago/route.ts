import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendAppointmentConfirmation } from "@/services/whatsapp";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify signature
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");
    const dataId = req.nextUrl.searchParams.get("data.id");

    if (xSignature) {
      const parts = xSignature.split(",");
      let ts = "";
      let hash = "";

      for (const part of parts) {
        const [key, value] = part.split("=");
        if (key.trim() === "ts") ts = value.trim();
        if (key.trim() === "v1") hash = value.trim();
      }

      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const expected = crypto
        .createHmac("sha256", process.env.MP_WEBHOOK_SECRET!)
        .update(manifest)
        .digest("hex");

      if (expected !== hash) {
        console.error("Webhook signature verification failed");
        return NextResponse.json({ ok: false }, { status: 401 });
      }
    }

    if (body.type === "payment" && body.data?.id) {
      const paymentId = String(body.data.id);

      // Fetch payment details from MP
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        },
      );

      const payment = await paymentResponse.json();
      console.log("MP Payment status:", payment.status);
      console.log("MP external_reference:", payment.external_reference);

      if (payment.status === "approved" && payment.external_reference) {
        const updated = await db.appointment.update({
          where: { id: payment.external_reference },
          data: {
            status: "PAID",
            payment: {
              create: {
                mercadopagoId: paymentId,
                amount: Math.round(payment.transaction_amount * 100),
                status: payment.status,
              },
            },
          },
        });

        console.log("Appointment marked as PAID:", payment.external_reference);

        // Send WhatsApp confirmation
        await sendAppointmentConfirmation({
          telephone: updated.telephone,
          date: format(updated.date, "dd/MM/yyyy", { locale: es }),
          hour: updated.time,
          appointmentId: updated.id,
        });

        console.log("WhatsApp confirmation sent to:", updated.telephone);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
