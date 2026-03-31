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

// ─── Shop metrics ─────────────────────────────────────────────────────────────

export interface ShopStats {
  totalOrders: number;
  totalOrdersDelta: number;
  shopRevenue: number;
  shopRevenueDelta: number;
  avgTicket: number;
  avgTicketDelta: number;
}

export interface CategorySales {
  name: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

export interface OrdersByStatus {
  status: string;
  label: string;
  count: number;
  color: string;
}

// ─── Financial metrics ────────────────────────────────────────────────────────

export interface RevenueBySource {
  name: string;
  value: number;
}

export interface RevenueByMethod {
  name: string;
  value: number;
}

// ─── Client metrics ──────────────────────────────────────────────────────────

export interface TopClient {
  name: string;
  phone: string;
  totalSpent: number;
}

export interface ClientSegment {
  name: string;
  value: number;
}

// ─── Combined period data ────────────────────────────────────────────────────

export interface PeriodData {
  stats: PeriodStats;
  byDay: { label: string; turnos: number }[];
  byHour: { label: string; turnos: number }[];
  growth: { label: string; current: number; previous: number }[];

  // Shop
  shopStats: ShopStats;
  salesByCategory: CategorySales[];
  topProducts: TopProduct[];
  ordersByStatus: OrdersByStatus[];

  // Financial
  revenueBySource: RevenueBySource[];
  revenueByMethod: RevenueByMethod[];

  // Clients
  topClients: TopClient[];
  clientSegments: ClientSegment[];
}
