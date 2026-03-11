import { NextRequest, NextResponse } from "next/server";
import { handleIncomingMessage } from "./handler";

const VERIFY_TOKEN = process.env.WHATSAPP_CHATBOT_VERIFY_TOKEN;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verificado");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("❌ WhatsApp webhook: token inválido");
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) {
      return new NextResponse("OK", { status: 200 });
    }

    if (message.type !== "text") {
      return new NextResponse("OK", { status: 200 });
    }

    const from = message.from as string;
    const text = message.text?.body as string;
    const contactName =
      change?.value?.contacts?.[0]?.profile?.name ?? "Cliente";

    if (!from || !text) {
      return new NextResponse("OK", { status: 200 });
    }

    console.log(`📱 De: ${from} (${contactName}) | Texto: "${text}"`);

    await handleIncomingMessage(from, text, contactName);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook WhatsApp:", error);
    return new NextResponse("OK", { status: 200 });
  }
}
