export const DAYS = [
  { key: "monday", label: "Lun" },
  { key: "tuesday", label: "Mar" },
  { key: "wednesday", label: "Mie" },
  { key: "thursday", label: "Jue" },
  { key: "friday", label: "Vie" },
  { key: "saturday", label: "Sab" },
  { key: "sunday", label: "Dom" },
] as const;

export const ALL_HOURS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
] as const;

export type DayKey = (typeof DAYS)[number]["key"];
export type Hour = (typeof ALL_HOURS)[number];

export type DaysConfig = Record<DayKey, boolean>;

export interface HourConfig {
  enabled: boolean;
  maxBookings: number;
}

export type HoursConfig = Record<DayKey, Record<string, HourConfig>>;

export interface DiscountCode {
  id: string;
  code: string;
  discount: number;
  validFrom: Date;
  validUntil: Date;
}

export interface ConfigData {
  days: DaysConfig;
  hours: HoursConfig;
  bookingCost: number;
  discountCodes: DiscountCode[];
}
