import { CalendarDays, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { getDashboardAction } from "@/app/admin/_actions/get-dashboard";

export default async function DashboardData() {
  const data = await getDashboardAction();

  const cards = [
    {
      icon: CalendarDays,
      label: "Turnos hoy",
      value: String(data.todayAppointments),
      detail: data.nextAppointment
        ? `Próximo: ${data.nextAppointment.time} hs — ${data.nextAppointment.clientName}`
        : "Sin turnos próximos",
      detailIcon: Clock,
    },
    {
      icon: ShoppingBag,
      label: "Pedidos pendientes",
      value: String(data.pendingOrders),
      detail:
        data.pendingOrders === 0
          ? "Todo al día"
          : `${data.pendingOrders} ${data.pendingOrders === 1 ? "pedido requiere" : "pedidos requieren"} atención`,
    },
    {
      icon: DollarSign,
      label: "Ingresos del día",
      value: `$${data.todayRevenue.toLocaleString("es-AR")}`,
      detail: "Turnos + tienda",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-border-subtle dark:border-zinc-800 shadow-sm p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-500">
              {card.label}
            </p>
            <card.icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100 leading-none">
            {card.value}
          </p>
          <p className="text-xs text-content-tertiary dark:text-zinc-500">
            {card.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
