import "dotenv/config";

import { PrismaClient, AppointmentStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// ✅ Adapter recibe la connection string directamente
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const db = new PrismaClient({ adapter });

const TIMES = ["08:00", "09:00", "10:00", "11:00", "16:00", "17:00", "18:00"];
const TELEPHONE = "5493794800756";
const TODAY = new Date(2026, 2, 5, 0, 0, 0, 0);

async function seed() {
  console.log("🌱 Seeding 20 appointments for today (2026-03-05)...");

  const times = [...TIMES, ...TIMES, ...TIMES].slice(0, 20);
  const shuffled = times.sort(() => Math.random() - 0.5);

  const appointments = shuffled.map((time, i) => ({
    date: TODAY,
    time,
    telephone: TELEPHONE,
    status: i < 15 ? AppointmentStatus.PAID : AppointmentStatus.PENDING,
    paymentId:
      i < 15 ? `mp_seed_${Math.random().toString(36).slice(2, 10)}` : null,
  }));

  await db.appointment.createMany({ data: appointments });

  console.log("✅ 20 appointments created for today");
}

async function drop() {
  console.log("🗑️  Deleting all appointments...");
  const { count } = await db.appointment.deleteMany();
  console.log(`✅ Deleted ${count} appointments`);
}

async function main() {
  const arg = process.argv[2];

  if (arg === "seed") {
    await seed();
  } else if (arg === "drop") {
    await drop();
  } else {
    console.log("Usage:");
    console.log("  pnpm seed   → create 20 appointments");
    console.log("  pnpm drop   → delete all appointments");
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
