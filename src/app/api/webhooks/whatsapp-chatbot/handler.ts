import {
  sendMainMenu,
  handleAwaitingOption,
  handleAwaitingAppointmentSelection,
  handleAwaitingDate,
  handleAwaitingHour,
  handleConfirmingChange,
  handleAwaitingLucketeContact,
  handleAwaitingLucketeMessage,
  handleDirectModify,
} from "./steps";
import { db } from "@/lib/db";

export async function handleIncomingMessage(
  from: string,
  text: string,
  contactName: string,
) {
  // Detectar patrón "Modificar turno #ID" antes de verificar sesión
  const modifyMatch = text.match(/modificar mi turno #([a-z0-9]+)/i);
  if (modifyMatch) {
    const appointmentId = modifyMatch[1];
    return await handleDirectModify(from, appointmentId);
  }

  const session = await db.whatsappChatbotSession.findUnique({
    where: { telephone: from },
  });

  if (!session || session.expiresAt < new Date()) {
    return await sendMainMenu(from);
  }

  switch (session.step) {
    case "AWAITING_OPTION":
      return await handleAwaitingOption(from, text);

    case "AWAITING_APPOINTMENT_SELECTION":
      return await handleAwaitingAppointmentSelection(from, text, {
        appointmentId: session.appointmentId,
      });

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

    case "AWAITING_LUCKETE_CONTACT":
      return await handleAwaitingLucketeContact(from, text, contactName);

    case "AWAITING_LUCKETE_MESSAGE":
      return await handleAwaitingLucketeMessage(from, text, contactName);

    default:
      return await sendMainMenu(from);
  }
}
