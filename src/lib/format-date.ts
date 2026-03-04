import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

const TZ = "America/Argentina/Buenos_Aires";

/** "27/02/2026" */
export function formatDate(date: Date): string {
  return formatInTimeZone(date, TZ, "dd/MM/yyyy", { locale: es });
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
