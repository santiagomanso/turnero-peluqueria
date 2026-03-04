import { formatArgentinianPhone } from "@/lib/format-phone";

const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

const MAPS_LINK = "https://maps.app.goo.gl/T56dNBbQZaFUNDJi6";
const SALON_NAME = "Luckete Colorista";

type SendConfirmationParams = {
  telephone: string;
  date: string;
  hour: string;
  appointmentId: string;
};

type SendReminderParams = {
  telephone: string;
  date: string;
  hour: string;
};

async function sendWhatsAppMessage(body: object) {
  const response = await fetch(WHATSAPP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("WhatsApp API error:", JSON.stringify(data, null, 2));
    throw new Error(`WhatsApp API error: ${response.status}`);
  }

  return data;
}

export async function sendAppointmentConfirmation({
  telephone,
  date,
  hour,
  appointmentId,
}: SendConfirmationParams) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to: formatArgentinianPhone(telephone),
    type: "template",
    template: {
      name: "appointment_confirmation_1",
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: SALON_NAME }, // {{1}}
            { type: "text", text: date }, // {{2}}
            { type: "text", text: hour }, // {{3}}
            { type: "text", text: MAPS_LINK }, // {{4}}
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            { type: "text", text: appointmentId }, // sufijo dinámico de la URL
          ],
        },
      ],
    },
  });
}

export async function sendAppointmentReminder({
  telephone,
  date,
  hour,
}: SendReminderParams) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to: formatArgentinianPhone(telephone),
    type: "template",
    template: {
      name: "appointment_reminder_2",
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: date }, // {{1}}
            { type: "text", text: hour }, // {{2}}
            { type: "text", text: MAPS_LINK }, // {{3}}
          ],
        },
      ],
    },
  });
}
