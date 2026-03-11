import {
  sendMainMenu,
  handleAwaitingOption,
  handleAwaitingDate,
  handleAwaitingHour,
  handleConfirmingChange,
} from "./steps";
import { db } from "@/lib/db";

export async function handleIncomingMessage(from: string, text: string) {
  // Buscar sesión activa
  const session = await db.whatsappChatbotSession.findUnique({
    where: { telephone: from },
  });

  // Si no hay sesión o expiró → mostrar menú principal
  if (!session || session.expiresAt < new Date()) {
    return await sendMainMenu(from);
  }

  // Rutear según el paso actual
  switch (session.step) {
    case "AWAITING_OPTION":
      return await handleAwaitingOption(from, text);

    case "AWAITING_DATE":
      return await handleAwaitingDate(from, text, {
        appointmentId: session.appointmentId,
      });

    case "AWAITING_HOUR":
      return await handleAwaitingHour(from, text, {
        appointmentId: session.appointmentId,
        newDate: session.newDate,
      });

    case "CONFIRMING_CHANGE":
      return await handleConfirmingChange(from, text, {
        appointmentId: session.appointmentId,
        newDate: session.newDate,
        newTime: session.newTime,
      });

    default:
      return await sendMainMenu(from);
  }
}
