"use server";

import { sendOrderReadyNotification } from "@/services/whatsapp";

export async function sendOrderReadyNotificationAction({
  orderId,
  telephone,
  customerName,
}: {
  orderId: string;
  telephone: string;
  customerName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await sendOrderReadyNotification({ orderId, telephone, customerName });
    return { success: true };
  } catch (error) {
    console.error("Error enviando WhatsApp orden lista:", error);
    return { success: false, error: "No se pudo enviar el WhatsApp" };
  }
}
