import { db } from "@/lib/db";
import { sendTextMessage } from "./send";
import { parseUserDate, parseUserTime } from "./parse-input";
import { formatDateLong, formatDateISO } from "@/lib/format-date";
import { getAvailabilityAction } from "@/app/appointments/_actions/get-availability";
import { addDays, startOfDay } from "date-fns";
import type { DaysConfig } from "@/types/config";

const SESSION_TTL_MINUTES = 30;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function updateSession(
  telephone: string,
  data: {
    step: string;
    appointmentId?: string | null;
    newDate?: string | null;
    newTime?: string | null;
  },
) {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_TTL_MINUTES);

  return db.whatsappChatbotSession.upsert({
    where: { telephone },
    create: { telephone, ...data, expiresAt },
    update: { ...data, expiresAt },
  });
}

async function deleteSession(telephone: string) {
  await db.whatsappChatbotSession.deleteMany({ where: { telephone } });
}

function getNextAvailableDays(daysConfig: DaysConfig, count = 7): Date[] {
  const dayKeyMap: Record<number, keyof DaysConfig> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const result: Date[] = [];
  const cursor = startOfDay(addDays(new Date(), 1));

  while (result.length < count) {
    const key = dayKeyMap[cursor.getDay()];
    if (daysConfig[key]) result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

// ─── Menú principal ─────────────────────────────────────────────────────────

export async function sendMainMenu(telephone: string) {
  await updateSession(telephone, { step: "AWAITING_OPTION" });
  await sendTextMessage(
    telephone,
    `¡Hola! Bienvenido/a al asistente de Luckete Colorista ✂️\n\n¿En qué te puedo ayudar?\n\n1️⃣ Ver mi turno\n2️⃣ Modificar mi turno\n3️⃣ Cancelar mi turno\n4️⃣ Hablar con Luckete`,
  );
}

// ─── Paso: esperando opción del menú ────────────────────────────────────────

export async function handleAwaitingOption(telephone: string, text: string) {
  const input = text.trim();

  if (input === "1") return await handleViewAppointment(telephone);
  if (input === "2") return await handleStartModify(telephone);
  if (input === "3") return await handleCancelAppointment(telephone);
  if (input === "4") return await handleTalkToLuckete(telephone);

  await sendTextMessage(telephone, "No entendí, escribí 1, 2, 3 o 4 👆");
}

// ─── Opción 1: Ver turno ─────────────────────────────────────────────────────

async function handleViewAppointment(telephone: string) {
  const appointment = await db.appointment.findFirst({
    where: {
      telephone: { endsWith: telephone.slice(-10) },
      status: { in: ["PENDING", "PAID"] },
      date: { gte: startOfDay(new Date()) },
    },
    orderBy: { date: "asc" },
  });

  if (!appointment) {
    await deleteSession(telephone);
    return await sendTextMessage(
      telephone,
      `No encontré ningún turno activo a tu nombre.\n\n¿Querés reservar uno? 👉 ${process.env.NEXT_PUBLIC_APP_URL}/appointments/new`,
    );
  }

  await deleteSession(telephone);
  await sendTextMessage(
    telephone,
    `Tu próximo turno es:\n\n📅 ${formatDateLong(appointment.date)}\n🕐 ${appointment.time} hs\n\nNos vemos pronto ✂️`,
  );
}

// ─── Opción 2: Modificar turno ───────────────────────────────────────────────

async function handleStartModify(telephone: string) {
  const appointment = await db.appointment.findFirst({
    where: {
      telephone: { endsWith: telephone.slice(-10) },
      status: { in: ["PENDING", "PAID"] },
      date: { gte: startOfDay(new Date()) },
    },
    orderBy: { date: "asc" },
  });

  if (!appointment) {
    await deleteSession(telephone);
    return await sendTextMessage(
      telephone,
      `No encontré ningún turno activo a tu nombre.\n\n¿Querés reservar uno? 👉 ${process.env.NEXT_PUBLIC_APP_URL}/appointments/new`,
    );
  }

  const config = await db.config.findUnique({ where: { id: "singleton" } });
  const daysConfig = config?.days as DaysConfig;

  const availableDays = getNextAvailableDays(daysConfig, 7);

  const daysList = availableDays
    .map((d, i) => `${i + 1}️⃣ ${formatDateLong(d)}`)
    .join("\n");

  await updateSession(telephone, {
    step: "AWAITING_DATE",
    appointmentId: appointment.id,
  });

  await sendTextMessage(
    telephone,
    `Tu turno actual es el ${formatDateLong(appointment.date)} a las ${appointment.time} hs.\n\n¿Qué fecha preferís para el nuevo turno?\n\n📅 Días disponibles:\n\n${daysList}\n\nRespondé con el número del día o escribí una fecha (ej: *22/03*)`,
  );
}

// ─── Paso: esperando fecha ───────────────────────────────────────────────────

export async function handleAwaitingDate(
  telephone: string,
  text: string,
  session: { appointmentId: string | null },
) {
  const config = await db.config.findUnique({ where: { id: "singleton" } });
  const daysConfig = config?.days as DaysConfig;
  const availableDays = getNextAvailableDays(daysConfig, 7);

  const date = parseUserDate(text, availableDays);

  if (!date) {
    return await sendTextMessage(
      telephone,
      `No entendí esa fecha 😕\n\nEscribí un número de la lista o una fecha como *22/03*`,
    );
  }

  // Verificar que el día esté habilitado en config
  const dayKeyMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };
  const dayKey = dayKeyMap[date.getDay()];
  if (!daysConfig[dayKey as keyof DaysConfig]) {
    return await sendTextMessage(
      telephone,
      `Ese día no está disponible para turnos 😕\n\nElegí otro día de la lista o escribí otra fecha.`,
    );
  }

  // Obtener horas disponibles
  const availability = await getAvailabilityAction(date);

  if (!availability.success || !availability.hours) {
    return await sendTextMessage(
      telephone,
      `Hubo un error al obtener los horarios. Intentá de nuevo.`,
    );
  }

  const availableHours = availability.hours.filter((h) => h.available);

  if (availableHours.length === 0) {
    return await sendTextMessage(
      telephone,
      `No quedan horarios disponibles para el ${formatDateLong(date)} 😕\n\nElegí otro día.`,
    );
  }

  const hoursList = availableHours
    .map((h, i) => `${i + 1}️⃣ ${h.time}`)
    .join("\n");

  await updateSession(telephone, {
    step: "AWAITING_HOUR",
    appointmentId: session.appointmentId,
    newDate: formatDateISO(date),
  });

  await sendTextMessage(
    telephone,
    `📅 ${formatDateLong(date)}\n\n¿A qué hora te queda mejor?\n\n🕐 Horarios disponibles:\n\n${hoursList}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
  );
}

// ─── Paso: esperando hora ────────────────────────────────────────────────────

export async function handleAwaitingHour(
  telephone: string,
  text: string,
  session: { appointmentId: string | null; newDate: string | null },
) {
  const availability = await getAvailabilityAction(
    new Date(session.newDate + "T12:00:00"),
  );

  if (!availability.success || !availability.hours) {
    return await sendTextMessage(
      telephone,
      `Hubo un error al obtener los horarios. Intentá de nuevo.`,
    );
  }

  const availableHours =
    availability.hours
      ?.filter((h) => h.available)
      .map((h) => h.time as string) ?? [];
  const time = parseUserTime(text, availableHours);

  if (!time) {
    const hoursList = availableHours.map((h, i) => `${i + 1}️⃣ ${h}`).join("\n");
    return await sendTextMessage(
      telephone,
      `No entendí ese horario 😕\n\nElegí uno de la lista o escribí la hora:\n\n${hoursList}`,
    );
  }

  // Verificar que el horario elegido esté disponible
  const isAvailable = availableHours.includes(time);
  if (!isAvailable) {
    const hoursList = availableHours.map((h, i) => `${i + 1}️⃣ ${h}`).join("\n");
    return await sendTextMessage(
      telephone,
      `Ese horario no está disponible 😕\n\nElegí uno de estos:\n\n${hoursList}`,
    );
  }

  const dateForDisplay = new Date(session.newDate + "T12:00:00");

  await updateSession(telephone, {
    step: "CONFIRMING_CHANGE",
    appointmentId: session.appointmentId,
    newDate: session.newDate,
    newTime: time,
  });

  await sendTextMessage(
    telephone,
    `Perfecto! Antes de confirmar, revisá los datos 👀\n\n✏️ Fecha nueva: ${formatDateLong(dateForDisplay)} a las ${time} hs\n\n¿Confirmamos el cambio?\n\n1️⃣ ✅ Sí, confirmar\n2️⃣ ❌ No, elegir otro horario\n3️⃣ 🔙 Volver al menú principal`,
  );
}

// ─── Paso: confirmando cambio ────────────────────────────────────────────────

export async function handleConfirmingChange(
  telephone: string,
  text: string,
  session: {
    appointmentId: string | null;
    newDate: string | null;
    newTime: string | null;
  },
) {
  const input = text.trim();

  if (input === "2") {
    // Volver a elegir hora
    await updateSession(telephone, {
      step: "AWAITING_HOUR",
      appointmentId: session.appointmentId,
      newDate: session.newDate,
    });
    const availability = await getAvailabilityAction(
      new Date(session.newDate + "T12:00:00"),
    );
    const availableHours = availability.hours?.filter((h) => h.available) ?? [];
    const hoursList = availableHours
      .map((h, i) => `${i + 1}️⃣ ${h.time}`)
      .join("\n");
    return await sendTextMessage(
      telephone,
      `¿A qué hora te queda mejor?\n\n🕐 Horarios disponibles:\n\n${hoursList}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
    );
  }

  if (input === "3") {
    await deleteSession(telephone);
    return await sendMainMenu(telephone);
  }

  if (input !== "1") {
    return await sendTextMessage(telephone, `No entendí, escribí 1, 2 o 3 👆`);
  }

  // Confirmar cambio — verificar disponibilidad en tiempo real
  if (!session.appointmentId || !session.newDate || !session.newTime) {
    await deleteSession(telephone);
    return await sendTextMessage(
      telephone,
      `Algo salió mal 😕 Intentá de nuevo.`,
    );
  }

  const config = await db.config.findUnique({ where: { id: "singleton" } });
  const hoursConfig = config?.hours as Record<
    string,
    Record<string, { enabled: boolean; maxBookings: number }>
  >;

  const dayKeyMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const newDateObj = new Date(session.newDate + "T12:00:00");
  const dayKey = dayKeyMap[newDateObj.getDay()];
  const hourConfig = hoursConfig?.[dayKey]?.[session.newTime];

  if (!hourConfig?.enabled) {
    await deleteSession(telephone);
    return await sendTextMessage(
      telephone,
      `Ese horario ya no está disponible 😕\n\nEscribinos para coordinar otro turno.`,
    );
  }

  // Contar reservas activas para ese slot
  const activeBookings = await db.appointment.count({
    where: {
      date: new Date(session.newDate + "T00:00:00.000Z"),
      time: session.newTime,
      status: { in: ["PENDING", "PAID"] },
      id: { not: session.appointmentId }, // excluir el turno actual
    },
  });

  if (activeBookings >= hourConfig.maxBookings) {
    await updateSession(telephone, {
      step: "AWAITING_HOUR",
      appointmentId: session.appointmentId,
      newDate: session.newDate,
    });
    const availability = await getAvailabilityAction(newDateObj);
    const availableHours = availability.hours?.filter((h) => h.available) ?? [];
    const hoursList = availableHours
      .map((h, i) => `${i + 1}️⃣ ${h.time}`)
      .join("\n");
    return await sendTextMessage(
      telephone,
      `😕 Ese horario se acaba de completar.\n\n¿Querés elegir otro?\n\n${hoursList}`,
    );
  }

  // Todo ok — actualizar el turno
  await db.appointment.update({
    where: { id: session.appointmentId },
    data: {
      date: new Date(session.newDate + "T00:00:00.000Z"),
      time: session.newTime,
    },
  });

  await deleteSession(telephone);

  await sendTextMessage(
    telephone,
    `✅ ¡Listo! Tu turno fue modificado exitosamente.\n\n📅 ${formatDateLong(newDateObj)}\n🕐 ${session.newTime} hs\n\n📍 Cómo llegar: https://maps.app.goo.gl/T56dNBbQZaFUNDJi6\n\nNos vemos pronto ✂️`,
  );
}

// ─── Opción 3: Cancelar turno ────────────────────────────────────────────────

async function handleCancelAppointment(telephone: string) {
  await deleteSession(telephone);
  await sendTextMessage(
    telephone,
    `Para cancelar tu turno escribinos directamente y te ayudamos 🙏\n\nO podés hacerlo desde: ${process.env.NEXT_PUBLIC_APP_URL}/appointments/get`,
  );
}

// ─── Opción 4: Hablar con Luckete ────────────────────────────────────────────

async function handleTalkToLuckete(telephone: string) {
  await deleteSession(telephone);
  await sendTextMessage(
    telephone,
    `¡Con gusto! En breve alguien de Luckete te va a responder 💬✂️`,
  );
}
