"use client";

import { useRouter, usePathname } from "next/navigation";
import { CalendarDays, BarChart2, LogOut, Settings, Home } from "lucide-react";
import { logoutAdminAction } from "../_actions/verify-admin-password";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useAdminAppointments } from "../_hooks/use-admin-appointments";
import Image from "next/image";
import Link from "next/link";

const AppointmentControls = dynamic(
  () =>
    import("./admin-appointments-controls").then((m) => ({
      default: m.AppointmentControls,
    })),
  { ssr: false },
);
const PeriodTabs = dynamic(() => import("./period-tabs"), { ssr: false });
const MobileSheet = dynamic(() => import("./admin-mobile-sheet"), {
  ssr: false,
});

const NAV_ITEMS = [
  { href: "/admin/appointments", label: "Turnos", icon: CalendarDays },
  { href: "/admin/metrics", label: "Métricas", icon: BarChart2 },
  { href: "/admin/config", label: "Configuración", icon: Settings },
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
      <aside className="w-55 bg-white dark:bg-zinc-900 border-r border-border-subtle dark:border-zinc-800 sticky top-0 h-full shrink-0 flex flex-col max-lg:hidden">
        <div className="h-19 shrink-0 border-b border-border-subtle dark:border-zinc-800 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Luckete Colorista"
            width={36}
            height={36}
            className="object-contain dark:invert dark:brightness-0"
            priority
          />
        </div>

        <nav className="flex-1 px-3 pt-4 flex flex-col gap-0.5">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content dark:text-zinc-500 px-2 py-2">
            Panel de control
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
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
          <Link
            href="/"
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium text-content-secondary dark:text-zinc-400 border-transparent hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100 transition-all border"
          >
            <Home className="w-4 h-4 shrink-0" />
            Inicio
          </Link>
        </nav>

        <div className="px-3 h-17 border-t border-border-subtle dark:border-zinc-800 flex items-center shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium text-content-tertiary dark:text-zinc-500 hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile/tablet topbar */}
      <div className="hidden max-lg:flex fixed top-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 h-14 items-center justify-between px-4">
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
        {pathname === "/admin/appointments" && <AppointmentControls />}
        {pathname === "/admin/metrics" && <PeriodTabs />}
        {pathname === "/admin/config" && <div className="w-9" />}
      </div>
    </>
  );
}
