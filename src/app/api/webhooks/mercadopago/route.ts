import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import {
  sendAppointmentConfirmation,
  sendOrderConfirmation,
} from "@/services/whatsapp";
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
        const ref = payment.external_reference as string;

        if (ref.startsWith("order:")) {
          await handleShopOrderPayment(ref.slice(6), paymentId, payment);
        } else {
          await handleAppointmentPayment(ref, paymentId, payment);
        }
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// ─── Appointment payment ───────────────────────────────────────────────────────

async function handleAppointmentPayment(
  appointmentId: string,
  paymentId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payment: any,
) {
  const existing = await db.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!existing) {
    console.warn(
      `[MP Webhook] Appointment not found: ${appointmentId} — skipping`,
    );
    return;
  }

  const payerEmail = payment.payer?.email ?? null;
  const directFirst = payment.payer?.first_name ?? "";
  const directLast = payment.payer?.last_name ?? "";
  const directName = `${directFirst} ${directLast}`.trim();
  const payerName = directName.length > 0 ? directName : payerEmail;

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "PAID", payerName, payerEmail },
  });

  await db.payment.upsert({
    where: { appointmentId },
    create: {
      type: "appointment",
      source: "mercadopago",
      mercadopagoId: paymentId,
      amount: payment.transaction_amount,
      status: payment.status,
      appointmentId,
    },
    update: { status: payment.status },
  });

  console.log("Appointment marked as PAID:", appointmentId);

  await sendAppointmentConfirmation({
    telephone: existing.telephone,
    date: format(existing.date, "dd/MM/yyyy", { locale: es }),
    hour: existing.time,
    appointmentId: existing.id,
  });

  console.log("WhatsApp confirmation sent to:", existing.telephone);
}

// ─── Shop order payment ────────────────────────────────────────────────────────

async function handleShopOrderPayment(
  orderId: string,
  paymentId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payment: any,
) {
  const existing = await db.order.findUnique({ where: { id: orderId } });

  if (!existing) {
    console.warn(`[MP Webhook] Order not found: ${orderId} — skipping`);
    return;
  }

  await db.payment.upsert({
    where: { orderId },
    create: {
      type: "shop_order",
      source: "mercadopago",
      mercadopagoId: paymentId,
      amount: payment.transaction_amount,
      status: payment.status,
      orderId,
    },
    update: { status: payment.status },
  });

  console.log("Order payment recorded:", orderId);

  try {
    await sendOrderConfirmation({
      telephone: existing.telephone,
      customerName: existing.name ?? "Cliente",
      orderId,
    });
  } catch (err) {
    console.error("[MP Webhook] WhatsApp order confirmation failed:", err);
  }
}
