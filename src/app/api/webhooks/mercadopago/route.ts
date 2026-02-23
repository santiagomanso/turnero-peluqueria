import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

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
        return NextResponse.json({ ok: false }, { status: 401 });
      }
    }

    // Update appointment with paymentId when payment is approved
    if (body.type === "payment" && body.data?.id) {
      const paymentId = String(body.data.id);

      await db.appointment.updateMany({
        where: {
          paymentId: null,
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 30), // last 30 minutes
          },
        },
        data: { paymentId },
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
