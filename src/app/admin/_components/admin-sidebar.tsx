"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  CalendarDays,
  BarChart2,
  LogOut,
  Settings,
  Home,
  CalendarPlus,
  Search,
  ShoppingBag,
} from "lucide-react";
import { logoutAdminAction } from "../_actions/verify-admin-password";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AppointmentsMobileControls = dynamic(
  () =>
    import("./appointments-mobile-controls").then((m) => ({
      default: m.AppointmentsMobileControls,
    })),
  { ssr: false },
);
const MetricsMobileControls = dynamic(
  () =>
    import("./sidebar-metrics-mobile-controls").then((m) => ({
      default: m.SidebarMetricsMobileControls,
    })),
  { ssr: false },
);
const MobileSheet = dynamic(() => import("./admin-mobile-sheet"), {
  ssr: false,
});

const NAV_ITEMS = [
  { href: "/admin/appointments", label: "Turnos", icon: CalendarDays },
  { href: "/admin/metrics", label: "Métricas", icon: BarChart2 },
  { href: "/admin/config", label: "Configuración", icon: Settings },
];

const PUBLIC_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/appointments/new", label: "Agendar turno", icon: CalendarPlus },
  { href: "/appointments/get", label: "Consultar turno", icon: Search },
  { href: "/shop", label: "Tienda online", icon: ShoppingBag },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { appointments, hasFetched, isLoading } = useAdminAppointments();

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
  };

  const activeLabel =
    NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.label ?? "Admin";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-55 bg-gray-50 dark:bg-zinc-900 border-r border-border-subtle dark:border-zinc-800 sticky top-0 h-full shrink-0 flex flex-col max-lg:hidden">
        <div className="h-19 shrink-0 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Luckete Colorista"
            width={36}
            height={36}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
        </div>

        <nav className="flex-1 px-3 pt-4 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-tertiary dark:text-zinc-500 px-2 py-2">
            Panel de Control
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  isActive
                    ? "bg-gold/10 text-content dark:text-zinc-100 border-gold/25 [&>svg]:text-gold"
                    : "text-content-secondary dark:text-zinc-400 border-transparent hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}

          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-tertiary dark:text-zinc-500 px-2 pt-3 pb-2">
            Público
          </p>
          {PUBLIC_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium text-content-secondary dark:text-zinc-400 border border-transparent hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100 transition-all"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 h-17 border-t border-border-subtle dark:border-zinc-800 flex items-center shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start px-2.5 rounded-xl text-content-tertiary dark:text-zinc-500 hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100 hover:cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile/tablet topbar */}
      <div className="hidden max-lg:flex fixed top-0 left-0 right-0 z-30 bg-gray-100 dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 h-14 items-center justify-between px-4">
        <MobileSheet onLogout={handleLogout} />
        <div className="relative flex items-center">
          <p className="font-heebo text-sm font-semibold tracking-wide text-content dark:text-zinc-100">
            {activeLabel}
          </p>
          {pathname === "/admin/appointments" &&
            hasFetched &&
            !isLoading &&
            appointments.length > 0 && (
              <span className="absolute -top-1 -right-4.5 min-w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold text-white bg-gold rounded-full px-1 leading-none">
                {appointments.length}
              </span>
            )}
        </div>
        {pathname === "/admin/appointments" && <AppointmentsMobileControls />}
        {pathname === "/admin/metrics" && <MetricsMobileControls />}
        {pathname === "/admin/config" && <div className="w-9" />}
      </div>
    </>
  );
}
