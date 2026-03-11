import { NextRequest, NextResponse } from "next/server";

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

    // Meta necesita 200 OK inmediato o reintenta
    console.log("📨 WhatsApp mensaje entrante:", JSON.stringify(body, null, 2));

    // Verificar que es un mensaje real y no otro tipo de evento
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) {
      // Es otro tipo de evento (delivery receipt, etc), ignorar
      return new NextResponse("OK", { status: 200 });
    }

    const from = message.from; // teléfono del usuario ej: "5493794800756"
    const text = message.text?.body; // texto del mensaje ej: "Hola"
    const messageType = message.type; // "text", "image", etc

    console.log(`📱 De: ${from} | Tipo: ${messageType} | Texto: "${text}"`);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook WhatsApp:", error);
    // Igual respondemos 200 para que Meta no reintente
    return new NextResponse("OK", { status: 200 });
  }
}
