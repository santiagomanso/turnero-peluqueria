import { db } from "@/lib/db";
import { sendTextMessage } from "./send";
import { parseUserDate, parseUserTime } from "./parse-input";
import { formatDateLong, formatDateISO } from "@/lib/format-date";
import { getAvailabilityAction } from "@/app/appointments/_actions/get-availability";
import { addDays, startOfDay, isWeekend } from "date-fns";
import type { DaysConfig } from "@/types/config";

const SESSION_TTL_MINUTES = 30;
const SEP = "─────────────────────";

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

function buildDaysList(days: Date[]): string {
  const weekdays = days.filter((d) => !isWeekend(d));
  const weekend = days.filter((d) => isWeekend(d));

  let list = "";
  let counter = 1;

  if (weekdays.length > 0) {
    list += `📋 Entre semana\n\n`;
    for (const d of weekdays) {
      list += `${String(counter).padEnd(2)} → 📆 ${formatDateLong(d)}\n`;
      counter++;
    }
  }

  if (weekend.length > 0) {
    if (weekdays.length > 0) list += `\n${SEP}\n\n`;
    list += `🌅 Fin de semana\n\n`;
    for (const d of weekend) {
      list += `${String(counter).padEnd(2)} → 📆 ${formatDateLong(d)}\n`;
      counter++;
    }
  }

  return list.trim();
}

function buildHoursList(hours: string[]): string {
  const morning = hours.filter((h) => parseInt(h.split(":")[0]) < 13);
  const afternoon = hours.filter((h) => parseInt(h.split(":")[0]) >= 13);

  let list = "";
  let counter = 1;

  if (morning.length > 0) {
    list += `🌅 Por la mañana\n\n`;
    for (const h of morning) {
      list += `${String(counter).padEnd(2)} → 🕐 ${h}\n`;
      counter++;
    }
  }

  if (afternoon.length > 0) {
    if (morning.length > 0) list += `\n${SEP}\n\n`;
    list += `🌇 Por la tarde\n\n`;
    for (const h of afternoon) {
      list += `${String(counter).padEnd(2)} → 🕐 ${h}\n`;
      counter++;
    }
  }

  return list.trim();
}

// ─── Menú principal ─────────────────────────────────────────────────────────

export async function sendMainMenu(telephone: string) {
  await updateSession(telephone, { step: "AWAITING_OPTION" });
  await sendTextMessage(
    telephone,
    `${SEP}\n🤖 ¿En qué te puedo ayudar?\n${SEP}\n\n1  → 👁️ Ver mi turno\n2  → ✏️ Modificar mi turno\n3  → ❌ Cancelar mi turno\n4  → 💬 Hablar con Luckete`,
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
  const appointments = await db.appointment.findMany({
    where: {
      telephone: { endsWith: telephone.slice(-10) },
      status: { in: ["PENDING", "PAID"] },
      date: { gte: startOfDay(new Date()) },
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  if (appointments.length === 0) {
    await deleteSession(telephone);
    return await sendTextMessage(
      telephone,
      `No encontré ningún turno activo a tu nombre.\n\n¿Querés reservar uno? 👉 ${process.env.NEXT_PUBLIC_APP_URL}/appointments/new`,
    );
  }

  if (appointments.length === 1) {
    return await startDateSelection(telephone, appointments[0].id);
  }

  const list = appointments
    .map(
      (a, i) =>
        `${String(i + 1).padEnd(2)} → 📅 ${formatDateLong(a.date)} a las ${a.time} hs`,
    )
    .join("\n");

  await updateSession(telephone, {
    step: "AWAITING_APPOINTMENT_SELECTION",
    appointmentId: appointments.map((a) => a.id).join(","),
  });

  await sendTextMessage(
    telephone,
    `${SEP}\n📋 Tus turnos activos\n${SEP}\n\n${list}`,
  );
}

// ─── Helper: arrancar selección de fecha ────────────────────────────────────

async function startDateSelection(telephone: string, appointmentId: string) {
  const config = await db.config.findUnique({ where: { id: "singleton" } });
  const daysConfig = config?.days as DaysConfig;
  const availableDays = getNextAvailableDays(daysConfig, 7);

  await updateSession(telephone, {
    step: "AWAITING_DATE",
    appointmentId,
  });

  await sendTextMessage(
    telephone,
    `${SEP}\n📅 Días disponibles\n${SEP}\n\n${buildDaysList(availableDays)}\n\nRespondé con el número del día o escribí una fecha (ej: *22/03*)`,
  );
}

// ─── Paso: esperando selección de turno ─────────────────────────────────────

export async function handleAwaitingAppointmentSelection(
  telephone: string,
  text: string,
  session: { appointmentId: string | null },
) {
  const ids = session.appointmentId?.split(",") ?? [];
  const index = parseInt(text.trim()) - 1;

  if (isNaN(index) || index < 0 || index >= ids.length) {
    return await sendTextMessage(
      telephone,
      `No entendí 😕 Escribí un número entre 1 y ${ids.length}`,
    );
  }

  return await startDateSelection(telephone, ids[index]);
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

  const hoursList = buildHoursList(availableHours.map((h) => h.time as string));

  await updateSession(telephone, {
    step: "AWAITING_HOUR",
    appointmentId: session.appointmentId,
    newDate: formatDateISO(date),
  });

  await sendTextMessage(
    telephone,
    `${SEP}\n🕐 Horarios disponibles\n${SEP}\n\n${hoursList}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
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
    return await sendTextMessage(
      telephone,
      `No entendí ese horario 😕\n\n${SEP}\n🕐 Horarios disponibles\n${SEP}\n\n${buildHoursList(availableHours)}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
    );
  }

  const isAvailable = availableHours.includes(time);
  if (!isAvailable) {
    return await sendTextMessage(
      telephone,
      `Ese horario no está disponible 😕\n\n${SEP}\n🕐 Horarios disponibles\n${SEP}\n\n${buildHoursList(availableHours)}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
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
    `${SEP}\n✅ ¿Confirmamos el cambio?\n${SEP}\n\n📅 ${formatDateLong(dateForDisplay)} a las ${time} hs\n\n1  → ✅ Sí, confirmar\n2  → 🔄 Elegir otro horario\n3  → 🔙 Volver al menú`,
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
    await updateSession(telephone, {
      step: "AWAITING_HOUR",
      appointmentId: session.appointmentId,
      newDate: session.newDate,
    });
    const availability = await getAvailabilityAction(
      new Date(session.newDate + "T12:00:00"),
    );
    const availableHours =
      availability.hours
        ?.filter((h) => h.available)
        .map((h) => h.time as string) ?? [];
    return await sendTextMessage(
      telephone,
      `${SEP}\n🕐 Horarios disponibles\n${SEP}\n\n${buildHoursList(availableHours)}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
    );
  }

  if (input === "3") {
    await deleteSession(telephone);
    return await sendMainMenu(telephone);
  }

  if (input !== "1") {
    return await sendTextMessage(telephone, `No entendí, escribí 1, 2 o 3 👆`);
  }

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

  const activeBookings = await db.appointment.count({
    where: {
      date: new Date(session.newDate + "T00:00:00.000Z"),
      time: session.newTime,
      status: { in: ["PENDING", "PAID"] },
      id: { not: session.appointmentId },
    },
  });

  if (activeBookings >= hourConfig.maxBookings) {
    await updateSession(telephone, {
      step: "AWAITING_HOUR",
      appointmentId: session.appointmentId,
      newDate: session.newDate,
    });
    const availability = await getAvailabilityAction(newDateObj);
    const availableHours =
      availability.hours
        ?.filter((h) => h.available)
        .map((h) => h.time as string) ?? [];
    return await sendTextMessage(
      telephone,
      `😕 Ese horario se acaba de completar.\n\n${SEP}\n🕐 Horarios disponibles\n${SEP}\n\n${buildHoursList(availableHours)}\n\nRespondé con el número o escribí la hora (ej: *10:30* o *a las 4*)`,
    );
  }

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
  await updateSession(telephone, { step: "AWAITING_LUCKETE_CONTACT" });
  await sendTextMessage(
    telephone,
    `¡Claro! La dueña de Luckete se va a comunicar con vos a la brevedad 💬✂️\n\n¿Querés dejarle un mensaje para que sepa sobre qué querés hablar?\n\nRespondé *SI* o *NO*`,
  );
}

// ─── Paso: esperando contacto con Luckete ───────────────────────────────────

export async function handleAwaitingLucketeContact(
  telephone: string,
  text: string,
  contactName: string,
) {
  const input = text.trim().toLowerCase();

  if (input === "no") {
    await deleteSession(telephone);
    await sendTextMessage(
      telephone,
      `✅ Listo. Luckete te va a escribir pronto ✂️`,
    );
    return await sendTextMessage(
      process.env.OWNER_PHONE!,
      `💬 Cliente quiere hablar\n\n👤 ${contactName}\n📞 +${telephone}`,
    );
  }

  if (input === "si" || input === "sí") {
    await updateSession(telephone, { step: "AWAITING_LUCKETE_MESSAGE" });
    return await sendTextMessage(
      telephone,
      `Escribí tu mensaje y se lo hacemos llegar 👇`,
    );
  }

  await sendTextMessage(telephone, `No entendí 😕 Respondé *SI* o *NO*`);
}

// ─── Paso: esperando mensaje para Luckete ───────────────────────────────────

export async function handleAwaitingLucketeMessage(
  telephone: string,
  text: string,
  contactName: string,
) {
  await deleteSession(telephone);

  await sendTextMessage(
    telephone,
    `✅ Mensaje recibido. Luckete te va a escribir pronto ✂️`,
  );

  await sendTextMessage(
    process.env.OWNER_PHONE!,
    `💬 Nueva consulta de cliente\n\n👤 ${contactName}\n📞 +${telephone}\n\n✉️ Mensaje:\n"${text}"`,
  );
}
