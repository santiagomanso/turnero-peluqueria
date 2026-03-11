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

    // Ignorar eventos que no son mensajes (delivery receipts, etc)
    if (!message) {
      return new NextResponse("OK", { status: 200 });
    }

    // Solo procesar mensajes de texto
    if (message.type !== "text") {
      return new NextResponse("OK", { status: 200 });
    }

    const from = message.from; // "5493794800756"
    const text = message.text?.body; // "Hola"

    if (!from || !text) {
      return new NextResponse("OK", { status: 200 });
    }

    console.log(`📱 De: ${from} | Texto: "${text}"`);

    // Procesar mensaje — no await para responder 200 rápido a Meta
    handleIncomingMessage(from, text).catch((err) =>
      console.error("❌ Error procesando mensaje:", err),
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook WhatsApp:", error);
    return new NextResponse("OK", { status: 200 });
  }
}
