"use client";

import { useState } from "react";
import { Menu, Home, Settings } from "lucide-react";
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
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/appointments", label: "Turnos", icon: CalendarDays },
  { href: "/admin/metrics", label: "Métricas", icon: BarChart2 },
  { href: "/admin/config", label: "Configuración", icon: Settings },
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
        <button className="p-2 rounded-lg border border-border-subtle dark:border-zinc-700 text-content-secondary dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-zinc-800 transition-all">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-60 p-0 flex flex-col bg-white dark:bg-zinc-900 dark:border-zinc-800"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

        <div className="py-5 border-b border-border-subtle dark:border-zinc-800 flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt="Luckete Colorista"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
          <p className="text-[0.6rem] uppercase tracking-[0.15em] text-content dark:text-zinc-500 leading-tight">
            Panel de control
          </p>
        </div>

        <nav className="flex flex-col flex-1 px-3 pt-4">
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

          <div className="mt-auto pt-4 border-t border-border-subtle dark:border-zinc-800 flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium text-content-tertiary dark:text-zinc-500 hover:bg-gold/8 dark:hover:bg-zinc-800 hover:text-content dark:hover:text-zinc-100 transition-all"
            >
              <Home className="w-4 h-4 shrink-0" />
              Inicio
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm font-medium text-content-tertiary dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
