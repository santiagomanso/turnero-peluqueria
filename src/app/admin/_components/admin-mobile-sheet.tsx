"use client";

import { useState } from "react";
import {
  Menu,
  Home,
  Settings,
  CalendarPlus,
  Search,
  ShoppingBag,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarDays, BarChart2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/appointments", label: "Turnos", icon: CalendarDays },
  { href: "/admin/metrics", label: "Métricas", icon: BarChart2 },
  { href: "/admin/config", label: "Configuración", icon: Settings },
  { href: "/admin/shop", label: "Tienda online", icon: ShoppingBag },
];

const PUBLIC_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/appointments/new", label: "Agendar turno", icon: CalendarPlus },
  { href: "/appointments/get", label: "Consultar turno", icon: Search },
  // { href: "/shop", label: "Tienda online", icon: ShoppingBag }, // TODO: re-enable when public shop is ready
];

export default function AdminMobileSheet({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-60 p-0 flex flex-col bg-white dark:bg-zinc-900 dark:border-zinc-800"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

        {/* Header */}
        <div className="py-5 border-b border-border-subtle dark:border-zinc-800 flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt="Luckete Colorista"
            width={48}
            height={48}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
          <p className="text-sm font-semibold text-content dark:text-zinc-100 tracking-wide">
            Luckete Colorista
          </p>
        </div>

        <nav className="flex flex-col flex-1 px-3 pt-4 overflow-y-auto">
          {/* Panel de Control */}
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-tertiary dark:text-zinc-500 px-2 pb-2">
            Panel de Control
          </p>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all border",
                    isActive
                      ? "bg-gold/10 text-content dark:text-zinc-100 border-gold/25 [&>svg]:text-gold"
                      : "text-content-secondary dark:text-zinc-400 border-transparent hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100",
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Público */}
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content-tertiary dark:text-zinc-500 px-2 pt-4 pb-2">
            Público
          </p>
          <div className="space-y-1">
            {PUBLIC_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium text-content-secondary dark:text-zinc-400 border border-transparent hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100 transition-all"
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Cerrar sesión */}
          <div className="mt-auto pt-4 border-t border-border-subtle dark:border-zinc-800">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start px-2.5 rounded-xl text-content-tertiary dark:text-zinc-500 hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Cerrar sesión
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
