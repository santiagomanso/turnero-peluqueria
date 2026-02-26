import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendAppointmentReminder } from "@/services/whatsapp";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all PAID appointments for today
    const appointments = await db.appointment.findMany({
      where: {
        status: "PAID",
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    console.log(`Sending reminders for ${appointments.length} appointments`);

    const results = await Promise.allSettled(
      appointments.map((appointment) =>
        sendAppointmentReminder({
          telephone: appointment.telephone,
          date: format(appointment.date, "dd/MM/yyyy", { locale: es }),
          hour: appointment.time,
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`Reminders sent: ${succeeded} succeeded, ${failed} failed`);

    return NextResponse.json({ ok: true, succeeded, failed });
  } catch (error) {
    console.error("Cron reminder error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
