import { db } from "@/lib/db";
import type { Period, PeriodData } from "@/types/metrics";
import { ORDER_STATUS_CONFIG } from "@/types/shop";

function calcDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function getUTCDay(date: Date): number {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
      0,
    ),
  ).getUTCDay();
}

function getUTCLabel(date: Date, period: Period): string {
  const d = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0,
      0,
    ),
  );
  if (period === "year") {
    return d.toLocaleString("es", { month: "short", timeZone: "UTC" });
  }
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}

function getDateRange(period: Period) {
  const now = new Date();
  const from = new Date(now);

  if (period === "week") from.setDate(now.getDate() - 7);
  else if (period === "month") from.setMonth(now.getMonth() - 1);
  else from.setFullYear(now.getFullYear() - 1);

  const prevFrom = new Date(from);
  if (period === "week") prevFrom.setDate(prevFrom.getDate() - 7);
  else if (period === "month") prevFrom.setMonth(prevFrom.getMonth() - 1);
  else prevFrom.setFullYear(prevFrom.getFullYear() - 1);

  return { now, from, prevFrom };
}

export async function getMetrics(period: Period): Promise<PeriodData> {
  const { from, prevFrom } = getDateRange(period);

  // ─── Parallel queries ───────────────────────────────────────────────────────
  const [
    appointments,
    prevAppointments,
    orders,
    prevOrders,
    payments,
    prevPayments,
  ] = await Promise.all([
    db.appointment.findMany({
      where: { date: { gte: from } },
      select: { date: true, time: true, status: true, price: true, telephone: true, payerName: true, payerEmail: true },
    }),
    db.appointment.findMany({
      where: { date: { gte: prevFrom, lte: from } },
      select: { date: true, status: true, price: true },
    }),
    db.order.findMany({
      where: { createdAt: { gte: from } },
      select: {
        id: true, status: true, total: true, paymentMethod: true,
        name: true, telephone: true, createdAt: true,
        items: { select: { quantity: true, unitPrice: true, product: { select: { name: true, category: true } } } },
      },
    }),
    db.order.findMany({
      where: { createdAt: { gte: prevFrom, lte: from } },
      select: { total: true },
    }),
    db.payment.findMany({
      where: { paidAt: { gte: from } },
      select: { type: true, source: true, amount: true },
    }),
    db.payment.findMany({
      where: { paidAt: { gte: prevFrom, lte: from } },
      select: { type: true, source: true, amount: true },
    }),
  ]);

  // ─── Appointment stats (existing) ──────────────────────────────────────────
  const total = appointments.length;
  const paid = appointments.filter((a) => a.status === "PAID").length;
  const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;
  const revenue = appointments
    .filter((a) => a.status === "PAID")
    .reduce((acc, a) => acc + (a.price ?? 0), 0);

  const prevTotal = prevAppointments.length;
  const prevPaid = prevAppointments.filter((a) => a.status === "PAID").length;
  const prevCancelled = prevAppointments.filter((a) => a.status === "CANCELLED").length;
  const prevRevenue = prevAppointments
    .filter((a) => a.status === "PAID")
    .reduce((acc, a) => acc + (a.price ?? 0), 0);

  // byDay
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const byDayMap: Record<string, number> = {};
  for (const a of appointments) {
    const label = dayNames[getUTCDay(a.date)];
    byDayMap[label] = (byDayMap[label] ?? 0) + 1;
  }
  const byDay = dayNames.map((label) => ({
    label,
    turnos: byDayMap[label] ?? 0,
  }));

  // byHour
  const byHourMap: Record<string, number> = {};
  for (const a of appointments) {
    byHourMap[a.time] = (byHourMap[a.time] ?? 0) + 1;
  }
  const byHour = Object.entries(byHourMap)
    .map(([label, turnos]) => ({ label, turnos }))
    .sort((a, b) => b.turnos - a.turnos)
    .slice(0, 5);

  // growth
  const currentMap: Record<string, number> = {};
  const previousMap: Record<string, number> = {};
  for (const a of appointments) {
    const label = getUTCLabel(a.date, period);
    currentMap[label] = (currentMap[label] ?? 0) + 1;
  }
  for (const a of prevAppointments) {
    const label = getUTCLabel(a.date, period);
    previousMap[label] = (previousMap[label] ?? 0) + 1;
  }
  const allLabels = Array.from(
    new Set([...Object.keys(currentMap), ...Object.keys(previousMap)]),
  );
  const growth = allLabels.map((label) => ({
    label,
    current: currentMap[label] ?? 0,
    previous: previousMap[label] ?? 0,
  }));

  // ─── Shop stats ────────────────────────────────────────────────────────────
  const totalOrders = orders.length;
  const prevTotalOrders = prevOrders.length;
  const shopRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const prevShopRevenue = prevOrders.reduce((acc, o) => acc + o.total, 0);
  const avgTicket = totalOrders > 0 ? Math.round(shopRevenue / totalOrders) : 0;
  const prevAvgTicket = prevTotalOrders > 0 ? Math.round(prevShopRevenue / prevTotalOrders) : 0;

  // Sales by category
  const categoryMap: Record<string, number> = {};
  for (const o of orders) {
    for (const item of o.items) {
      const cat = item.product.category;
      categoryMap[cat] = (categoryMap[cat] ?? 0) + item.unitPrice * item.quantity;
    }
  }
  const salesByCategory = Object.entries(categoryMap)
    .map(([name, rev]) => ({ name, revenue: rev }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top products
  const productMap: Record<string, number> = {};
  for (const o of orders) {
    for (const item of o.items) {
      productMap[item.product.name] = (productMap[item.product.name] ?? 0) + item.quantity;
    }
  }
  const topProducts = Object.entries(productMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Orders by status
  const statusMap: Record<string, number> = {};
  for (const o of orders) {
    statusMap[o.status] = (statusMap[o.status] ?? 0) + 1;
  }
  const ordersByStatus = Object.entries(statusMap).map(([status, count]) => {
    const cfg = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
    return { status, label: cfg?.label ?? status, count, color: cfg?.color ?? "#888" };
  });

  // ─── Financial metrics ─────────────────────────────────────────────────────
  const appointmentRevenue = payments
    .filter((p) => p.type === "appointment")
    .reduce((acc, p) => acc + p.amount, 0);
  const shopPaymentRevenue = payments
    .filter((p) => p.type === "shop_order")
    .reduce((acc, p) => acc + p.amount, 0);
  const revenueBySource = [
    { name: "Turnos", value: appointmentRevenue },
    { name: "Tienda", value: shopPaymentRevenue },
  ].filter((s) => s.value > 0);

  const mpRevenue = payments
    .filter((p) => p.source === "mercadopago")
    .reduce((acc, p) => acc + p.amount, 0);
  const cashRevenue = payments
    .filter((p) => p.source === "cash")
    .reduce((acc, p) => acc + p.amount, 0);
  const revenueByMethod = [
    { name: "MercadoPago", value: mpRevenue },
    { name: "Efectivo", value: cashRevenue },
  ].filter((s) => s.value > 0);

  // ─── Client metrics ────────────────────────────────────────────────────────
  // Build a map of phone → { name, totalSpent, isRecurring }
  const clientMap: Record<string, { name: string; phone: string; totalSpent: number; orderCount: number }> = {};

  for (const a of appointments.filter((a) => a.status === "PAID")) {
    const phone = a.telephone.slice(-10);
    if (!clientMap[phone]) {
      clientMap[phone] = {
        name: a.payerName ?? a.payerEmail ?? `+${a.telephone}`,
        phone: a.telephone,
        totalSpent: 0,
        orderCount: 0,
      };
    }
    clientMap[phone].totalSpent += a.price ?? 0;
    clientMap[phone].orderCount += 1;
  }

  for (const o of orders) {
    const phone = o.telephone.slice(-10);
    if (!clientMap[phone]) {
      clientMap[phone] = {
        name: o.name ?? `+${o.telephone}`,
        phone: o.telephone,
        totalSpent: 0,
        orderCount: 0,
      };
    }
    clientMap[phone].totalSpent += o.total;
    clientMap[phone].orderCount += 1;
  }

  const topClients = Object.values(clientMap)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map(({ name, phone, totalSpent }) => ({ name, phone, totalSpent }));

  const recurring = Object.values(clientMap).filter((c) => c.orderCount > 1).length;
  const newClients = Object.values(clientMap).filter((c) => c.orderCount === 1).length;
  const clientSegments = [
    { name: "Recurrentes", value: recurring },
    { name: "Nuevos", value: newClients },
  ].filter((s) => s.value > 0);

  // ─── Return ────────────────────────────────────────────────────────────────
  return {
    stats: {
      total,
      totalDelta: calcDelta(total, prevTotal),
      paid,
      paidDelta: calcDelta(paid, prevPaid),
      cancelled,
      cancelledDelta: calcDelta(cancelled, prevCancelled),
      revenue: `$${revenue.toLocaleString("es-AR")}`,
      revenueDelta: calcDelta(revenue, prevRevenue),
    },
    byDay,
    byHour,
    growth,
    shopStats: {
      totalOrders,
      totalOrdersDelta: calcDelta(totalOrders, prevTotalOrders),
      shopRevenue,
      shopRevenueDelta: calcDelta(shopRevenue, prevShopRevenue),
      avgTicket,
      avgTicketDelta: calcDelta(avgTicket, prevAvgTicket),
    },
    salesByCategory,
    topProducts,
    ordersByStatus,
    revenueBySource,
    revenueByMethod,
    topClients,
    clientSegments,
  };
}
