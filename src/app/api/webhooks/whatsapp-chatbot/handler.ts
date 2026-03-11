import { db } from "@/lib/db";
import {
  sendMainMenu,
  handleAwaitingOption,
  handleAwaitingAppointmentSelection,
  handleAwaitingDate,
  handleAwaitingHour,
  handleConfirmingChange,
} from "./steps";

export async function handleIncomingMessage(from: string, text: string) {
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

    default:
      return await sendMainMenu(from);
  }
}
