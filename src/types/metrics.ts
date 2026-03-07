export type Period = "week" | "month" | "year";

export interface PeriodStats {
  total: number;
  totalDelta: number;
  paid: number;
  paidDelta: number;
  cancelled: number;
  cancelledDelta: number;
  revenue: string;
  revenueDelta: number;
}

export interface PeriodData {
  stats: PeriodStats;
  byDay: { label: string; turnos: number }[];
  byHour: { label: string; turnos: number }[];
  growth: { label: string; current: number; previous: number }[];
}
