import { db } from "@/lib/db";
import { parseUserDate, parseUserTime } from "./parse-input";
import { formatDateLong, formatDateISO, formatDateLongFromISO } from "@/lib/format-date";
import { getAvailabilityAction } from "@/app/appointments/_actions/get-availability";
import { addDays, startOfDay, isWeekend } from "date-fns";
import type { DayKey, DaysConfig } from "@/types/config";
import { sendTextMessage } from "@/services/whatsapp";
import { getConfig } from "@/services/config";
import { updateAppointment } from "@/services/update";
import { getAppointmentById } from "@/services/get";

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

  // Use noon UTC so that formatDateISO (Argentina TZ, UTC-3) returns the same
  // calendar date as the UTC date — midnight UTC would become 21:00 the previous
  // day in ART, causing a one-day shift in all downstream formatting and storage.
  const tomorrow = addDays(new Date(), 1);
  const cursor = new Date(
    Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate(),
      12, 0, 0, 0,
    ),
  );

  while (result.length < count) {
    const key = dayKeyMap[cursor.getUTCDay()];
    if (daysConfig[key]) result.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

// Returns days in the same display order as buildDaysList: weekdays first, weekend last.
// Both functions must agree on ordering so the user's numeric choice maps correctly.
function getOrderedDays(days: Date[]): Date[] {
  return [
    ...days.filter((d) => !isWeekend(d)),
    ...days.filter((d) => isWeekend(d)),
  ];
}

function buildDaysList(days: Date[]): string {
  const weekdays = days.filter((d) => !isWeekend(d));
  const weekend = days.filter((d) => isWeekend(d));

  let list = "";
  let counter = 1;

  if (weekdays.length > 0) {
    list += `Entre semana\n`;
    for (const d of weekdays) {
      list += `${String(counter).padEnd(2)} → ${formatDateLong(d)}\n`;
      counter++;
    }
  }

  if (weekend.length > 0) {
    if (weekdays.length > 0) list += `\n`;
    list += `Fin de semana\n`;
    for (const d of weekend) {
      list += `${String(counter).padEnd(2)} → ${formatDateLong(d)}\n`;
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
    list += `Por la mañana\n`;
    for (const h of morning) {
      list += `${String(counter).padEnd(2)} → ${h}\n`;
      counter++;
    }
  }

  if (afternoon.length > 0) {
    if (morning.length > 0) list += `\n`;
    list += `Por la tarde\n`;
    for (const h of afternoon) {
      list += `${String(counter).padEnd(2)} → ${h}\n`;
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
    `🤖 ¿En qué te puedo ayudar?\n\nEscribí el número de la opción 👇\n\n1  → 👁️ Ver mi turno\n2  → ✏️ Modificar mi turno\n3  → ❌ Cancelar mi turno\n4  → 💬 Hablar con Luckete`,
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

  await updateSession(telephone, {
    step: "AWAITING_VIEW_ACTION",
    appointmentId: appointment.id,
  });

  await sendTextMessage(
    telephone,
    `Tu próximo turno es:\n\n📅 ${formatDateLongFromISO(appointment.date)}\n🕐 ${appointment.time} hs\n\n¿Deseás modificarlo?\n\nEscribí el número de la opción o *Si* / *No* 👇\n\n1  → ✅ Sí, modificar\n2  → ❌ No\n3  → 🔙 Volver al menú`,
  );
}

// ─── Paso: esperando acción sobre turno visto ────────────────────────────────

export async function handleAwaitingViewAction(
  telephone: string,
  text: string,
  session: { appointmentId: string | null },
) {
  const input = text.trim().toLowerCase();

  if (input === "1" || input === "si" || input === "sí") {
    if (!session.appointmentId) {
      await deleteSession(telephone);
      return await sendMainMenu(telephone);
    }
    return await startDateSelection(telephone, session.appointmentId);
  }

  if (input === "2" || input === "no") {
    await deleteSession(telephone);
    return await sendTextMessage(
      telephone,
      `¡Perfecto! Si necesitás algo más, no dudes en escribirnos ✂️`,
    );
  }

  if (input === "3") {
    await deleteSession(telephone);
    return await sendMainMenu(telephone);
  }

  await sendTextMessage(
    telephone,
    `No entendí 😕\n\nEscribí el número de la opción o *Si* / *No* 👇\n\n1  → ✅ Sí, modificar\n2  → ❌ No\n3  → 🔙 Volver al menú`,
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
        `${String(i + 1).padEnd(2)} → 📅 ${formatDateLongFromISO(a.date)} a las ${a.time} hs`,
    )
    .join("\n");

  await updateSession(telephone, {
    step: "AWAITING_APPOINTMENT_SELECTION",
    appointmentId: appointments.map((a) => a.id).join(","),
  });

  await sendTextMessage(telephone, `📋 Tus turnos activos\n\nEscribí el número del turno que querés modificar 👇\n\n${list}`);
}

// ─── Helper: arrancar selección de fecha ────────────────────────────────────

async function startDateSelection(telephone: string, appointmentId: string) {
  const [config, appointment] = await Promise.all([
    getConfig(),
    getAppointmentById(appointmentId),
  ]);

  const daysConfig = config?.days as DaysConfig;
  const availableDays = getNextAvailableDays(daysConfig, 7);

  await updateSession(telephone, {
    step: "AWAITING_DATE",
    appointmentId,
  });

  const originalInfo = appointment
    ? `Turno original\n📅 Fecha: ${formatDateLongFromISO(appointment.date)}\n🕐 Hora: ${appointment.time} hs\n\n`
    : "";

  await sendTextMessage(
    telephone,
    `${originalInfo}Días disponibles para el cambio\n\nEscribí el número de la opción o la fecha (ej: *22/03*) 👇\n\n${buildDaysList(availableDays)}`,
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
  const config = await getConfig();
  const daysConfig = config?.days as DaysConfig;
  const availableDays = getNextAvailableDays(daysConfig, 7);

  // Use the same display order as buildDaysList (weekdays first, then weekend)
  // so that the number the user sees maps to the correct date.
  const date = parseUserDate(text, getOrderedDays(availableDays));

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
    `🕐 Horarios disponibles\n\nEscribí el número de la opción o la hora (ej: *10:30* o *a las 4*) 👇\n\n${hoursList}`,
  );
}

// ─── Paso: esperando hora ────────────────────────────────────────────────────

export async function handleAwaitingHour(
  telephone: string,
  text: string,
  session: { appointmentId: string | null; newDate: string | null },
) {
  const availability = await getAvailabilityAction(
    new Date(session.newDate + "T12:00:00.000Z"),
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
      `No entendí ese horario 😕\n\n🕐 Horarios disponibles\n\nEscribí el número de la opción o la hora (ej: *10:30* o *a las 4*) 👇\n\n${buildHoursList(availableHours)}`,
    );
  }

  const isAvailable = availableHours.includes(time);
  if (!isAvailable) {
    return await sendTextMessage(
      telephone,
      `Ese horario no está disponible 😕\n\n🕐 Horarios disponibles\n\nEscribí el número de la opción o la hora (ej: *10:30* o *a las 4*) 👇\n\n${buildHoursList(availableHours)}`,
    );
  }

  const dateForDisplay = new Date(session.newDate + "T12:00:00.000Z");

  await updateSession(telephone, {
    step: "CONFIRMING_CHANGE",
    appointmentId: session.appointmentId,
    newDate: session.newDate,
    newTime: time,
  });

  await sendTextMessage(
    telephone,
    `✅ ¿Confirmamos el cambio?\n\n📅 ${formatDateLong(dateForDisplay)} a las ${time} hs\n\nEscribí el número de la opción 👇\n\n1  → ✅ Sí, confirmar\n2  → 🔄 Elegir otro horario\n3  → 🔙 Volver al menú`,
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
      new Date(session.newDate + "T12:00:00.000Z"),
    );
    const availableHours =
      availability.hours
        ?.filter((h) => h.available)
        .map((h) => h.time as string) ?? [];
    return await sendTextMessage(
      telephone,
      `🕐 Horarios disponibles\n\nEscribí el número de la opción o la hora (ej: *10:30* o *a las 4*) 👇\n\n${buildHoursList(availableHours)}`,
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

  const [config, originalAppointment] = await Promise.all([
    getConfig(),
    getAppointmentById(session.appointmentId),
  ]);

  const hoursConfig = config?.hours;

  const dayKeyMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const newDateObj = new Date(session.newDate + "T12:00:00.000Z");
  const dayKey = dayKeyMap[newDateObj.getUTCDay()];
  const hourConfig = hoursConfig?.[dayKey as DayKey]?.[session.newTime];

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
      `😕 Ese horario se acaba de completar.\n\n🕐 Horarios disponibles\n\nEscribí el número de la opción o la hora (ej: *10:30* o *a las 4*) 👇\n\n${buildHoursList(availableHours)}`,
    );
  }

  await updateAppointment({
    id: session.appointmentId,
    date: new Date(session.newDate + "T00:00:00.000Z"),
    time: session.newTime,
  });

  await deleteSession(telephone);

  const originalInfo = originalAppointment
    ? `Turno original: ${formatDateLongFromISO(originalAppointment.date)} a las ${originalAppointment.time} hs\nTurno nuevo:    ${formatDateLong(newDateObj)} a las ${session.newTime} hs\n\n`
    : "";

  await sendTextMessage(
    telephone,
    `✅ ¡Listo! Tu turno fue modificado exitosamente.\n\n${originalInfo}📍 Cómo llegar: https://maps.app.goo.gl/T56dNBbQZaFUNDJi6\n\nNos vemos pronto ✂️`,
  );
}

// ─── Directo: modificar turno por ID ────────────────────────────────────────

export async function handleDirectModify(
  telephone: string,
  appointmentId: string,
) {
  const appointment = await db.appointment.findFirst({
    where: {
      id: appointmentId,
      telephone: { endsWith: telephone.slice(-10) },
      status: { in: ["PENDING", "PAID"] },
      date: { gte: startOfDay(new Date()) },
    },
  });

  if (!appointment) {
    await deleteSession(telephone);
    await sendTextMessage(
      telephone,
      `No encontré ese turno 😕\n\nVerificá que el link sea correcto o escribí al menú para buscar tu turno.`,
    );
    return await sendMainMenu(telephone);
  }

  return await startDateSelection(telephone, appointment.id);
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
    `¡Claro! La dueña de Luckete se va a comunicar con vos a la brevedad 💬✂️\n\n¿Querés dejarle un mensaje para que sepa sobre qué querés hablar?\n\nEscribí el número o *Si* / *No* 👇\n\n1  → ✅ Sí\n2  → ❌ No`,
  );
}

// ─── Paso: esperando contacto con Luckete ───────────────────────────────────

export async function handleAwaitingLucketeContact(
  telephone: string,
  text: string,
  contactName: string,
) {
  const input = text.trim().toLowerCase();

  if (input === "no" || input === "2") {
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

  if (input === "si" || input === "sí" || input === "1") {
    await updateSession(telephone, { step: "AWAITING_LUCKETE_MESSAGE" });
    return await sendTextMessage(
      telephone,
      `Escribí tu mensaje y se lo hacemos llegar 👇`,
    );
  }

  await sendTextMessage(telephone, `No entendí 😕\n\nEscribí el número o *Si* / *No* 👇\n\n1  → ✅ Sí\n2  → ❌ No`);
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
