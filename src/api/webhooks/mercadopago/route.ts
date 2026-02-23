import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

    console.log("MP Webhook verified:", JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
