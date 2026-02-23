import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAppointment } from "@/services/create";

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

    // Handle approved payment
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
      console.log("MP Payment:", JSON.stringify(payment, null, 2));

      if (payment.status === "approved" && payment.external_reference) {
        const { date, hour, telephone } = JSON.parse(
          payment.external_reference,
        );

        const [year, month, day] = date.split("-").map(Number);
        const appointmentDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        await createAppointment({
          date: appointmentDate,
          time: hour,
          telephone,
          paymentId,
        });

        console.log("Appointment created via webhook for payment:", paymentId);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
