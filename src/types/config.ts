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
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

export type DayKey = (typeof DAYS)[number]["key"];
export type Hour = (typeof ALL_HOURS)[number];

export type DaysConfig = Record<DayKey, boolean>;

export interface HourConfig {
  enabled: boolean;
  maxBookings: number;
}

export type HoursConfig = Record<Hour, HourConfig>;

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
