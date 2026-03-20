import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

const TZ = "America/Argentina/Buenos_Aires";

/** "27/02/2026" */
export function formatDate(date: Date): string {
  return formatInTimeZone(date, TZ, "dd/MM/yyyy", { locale: es });
}

/** "19/03" — día y mes, sin año */
export function formatDateDayMonth(date: Date | string): string {
  return formatInTimeZone(new Date(date), TZ, "dd/MM");
}

/** "viernes 27 de febrero" */
export function formatDateLong(date: Date): string {
  return formatInTimeZone(date, TZ, "EEEE d 'de' MMMM", { locale: es });
}

/** "27 de febrero" */
export function formatDateShort(date: Date): string {
  return formatInTimeZone(date, TZ, "d 'de' MMMM", { locale: es });
}

/** "2026-02-27" — útil para comparar fechas */
export function formatDateISO(date: Date): string {
  return formatInTimeZone(date, TZ, "yyyy-MM-dd");
}

/** true si la fecha es hoy en Argentina */
export function isToday(date: Date): boolean {
  return formatDateISO(date) === formatDateISO(new Date());
}

/** "27 de febrero" para fechas que pueden venir con offset desde Server Actions */
export function formatDateFromISO(date: Date | string): string {
  const str = typeof date === "string" ? date : date.toISOString();
  const [year, month, day] = str.slice(0, 10).split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  return formatDateShort(utcDate);
}

/** "27/02/2026" para fechas que pueden venir con offset desde Server Actions */
export function formatDateNumericFromISO(date: Date | string): string {
  const str = typeof date === "string" ? date : date.toISOString();
  const [year, month, day] = str.slice(0, 10).split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  return formatDate(utcDate);
}

/** "viernes 27 de febrero" para fechas que pueden venir con offset desde Server Actions */
export function formatDateLongFromISO(date: Date | string): string {
  const str = typeof date === "string" ? date : date.toISOString();
  const [year, month, day] = str.slice(0, 10).split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  return formatDateLong(utcDate);
}

/** isToday para fechas que pueden venir con offset desde Server Actions */
export function isTodayFromISO(date: Date | string): boolean {
  const str = typeof date === "string" ? date : date.toISOString();
  const dateStr = str.slice(0, 10);
  return dateStr === formatDateISO(new Date());
}
