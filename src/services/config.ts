import { db } from "@/lib/db";
import type {
  ConfigData,
  DaysConfig,
  DiscountCode,
  HoursConfig,
} from "@/types/config";

export async function getConfig(): Promise<ConfigData | null> {
  const config = await db.config.findUnique({
    where: { id: "singleton" },
  });

  if (!config) return null;

  const rawCodes = config.discountCodes as unknown as Array<{
    id: string;
    code: string;
    discount: number;
    validFrom: string;
    validUntil: string;
  }>;

  return {
    days: config.days as unknown as DaysConfig,
    hours: config.hours as unknown as HoursConfig,
    bookingCost: config.bookingCost,
    discountCodes: rawCodes.map((c) => ({
      ...c,
      validFrom: new Date(c.validFrom),
      validUntil: new Date(c.validUntil),
    })),
  };
}

export async function upsertConfig(data: ConfigData): Promise<void> {
  await db.config.upsert({
    where: { id: "singleton" },
    update: {
      days: data.days as unknown as object,
      hours: data.hours as unknown as object,
      bookingCost: data.bookingCost,
      discountCodes: data.discountCodes as unknown as object[],
    },
    create: {
      id: "singleton",
      days: data.days as unknown as object,
      hours: data.hours as unknown as object,
      bookingCost: data.bookingCost,
      discountCodes: data.discountCodes as unknown as object[],
    },
  });
}
