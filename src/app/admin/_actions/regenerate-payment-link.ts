"use server";

import { regeneratePaymentLink } from "@/services/mercadopago";

export async function regeneratePaymentLinkAction(
  appointmentId: string,
): Promise<{ success: boolean; paymentUrl?: string; error?: string }> {
  try {
    const { paymentUrl } = await regeneratePaymentLink(appointmentId);
    return { success: true, paymentUrl };
  } catch (error) {
    console.error("Error regenerating payment link:", error);
    const message =
      error instanceof Error ? error.message : "No se pudo generar el link de pago.";
    return { success: false, error: message };
  }
}
