import Link from "next/link";
import {
  CalendarDays,
  ShoppingBag,
  DollarSign,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getDashboardAction } from "@/app/admin/_actions/get-dashboard";

export default async function DashboardData() {
  const data = await getDashboardAction();

  const cards = [
    {
      emoji: "📅",
      icon: CalendarDays,
      label: "Turnos hoy",
      value: String(data.todayAppointments),
      detail: data.nextAppointment
        ? `Próximo: ${data.nextAppointment.time} hs — ${data.nextAppointment.clientName}`
        : "Sin turnos próximos",
      detailIcon: Clock,
      href: "/admin/appointments",
      lightGradient: "from-sky-50 to-white",
      iconBgLight: "bg-sky-100",
      iconBgDark: "dark:bg-sky-500/20",
      iconColor: "text-sky-500 dark:text-sky-400",
      delay: "0ms",
    },
    {
      emoji: "🛍️",
      icon: ShoppingBag,
      label: "Pedidos pendientes",
      value: String(data.pendingOrders),
      detail:
        data.pendingOrders === 0
          ? "Todo al día ✓"
          : `${data.pendingOrders} ${data.pendingOrders === 1 ? "pedido requiere" : "pedidos requieren"} atención`,
      href: "/admin/shop",
      lightGradient: "from-violet-50 to-white",
      iconBgLight: "bg-violet-100",
      iconBgDark: "dark:bg-violet-500/20",
      iconColor: "text-violet-500 dark:text-violet-400",
      delay: "80ms",
    },
    {
      emoji: "💰",
      icon: DollarSign,
      label: "Ingresos del día",
      value: `$${data.todayRevenue.toLocaleString("es-AR")}`,
      detail: "Turnos + tienda",
      href: "/admin/payments",
      lightGradient: "from-emerald-50 to-white",
      iconBgLight: "bg-emerald-100",
      iconBgDark: "dark:bg-emerald-500/20",
      iconColor: "text-emerald-500 dark:text-emerald-400",
      delay: "160ms",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes dashCardIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dash-card {
          animation: dashCardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{ animationDelay: card.delay }}
            className={`
              dash-card group relative overflow-hidden
              bg-linear-to-br ${card.lightGradient}
              dark:bg-none dark:bg-zinc-800/60
              rounded-2xl border border-border-subtle dark:border-zinc-700/60
              shadow-sm p-5 flex flex-col gap-3
              transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
              hover:border-zinc-200 dark:hover:border-zinc-600
              active:translate-y-0 active:shadow-sm
              cursor-pointer
            `}
          >
            {/* Top row: label + icon */}
            <div className="flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-content-tertiary dark:text-zinc-400">
                {card.label}
              </p>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.iconBgLight} ${card.iconBgDark} transition-transform duration-200 group-hover:scale-110`}
              >
                <card.icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
              </div>
            </div>

            {/* Emoji + Value */}
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{card.emoji}</span>
              <p className="font-heebo text-2xl font-semibold text-content dark:text-zinc-100 leading-none">
                {card.value}
              </p>
            </div>

            {/* Detail + arrow */}
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xs text-content-tertiary dark:text-zinc-400">
                {card.detail}
              </p>
              <ArrowRight className="w-3.5 h-3.5 text-content-quaternary dark:text-zinc-500 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
