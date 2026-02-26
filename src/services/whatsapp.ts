const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

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
    to: telephone,
    type: "template",
    template: {
      name: "appointment_confirmation_1",
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: date },
            { type: "text", text: hour },
            { type: "text", text: appointmentId },
            { type: "text", text: "https://maps.app.goo.gl/fXLVneR8ndBgTUxG6" },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: appointmentId }],
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
    to: telephone,
    type: "template",
    template: {
      name: "appointment_reminder_2",
      language: { code: "es" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: date },
            { type: "text", text: hour },
            { type: "text", text: "https://maps.app.goo.gl/fXLVneR8ndBgTUxG6" },
          ],
        },
      ],
    },
  });
}
