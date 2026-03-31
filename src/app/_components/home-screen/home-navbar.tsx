"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  CalendarPlus,
  CalendarSearch,
  ShoppingBag,
  MessageCircle,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/public-theme-provider";
import { cn } from "@/lib/utils";

const DESKTOP_LINKS = [
  { label: "Agendar turno", href: "/appointments/new", external: false },
  { label: "Consultar turno", href: "/appointments/get", external: false },
  { label: "Tienda", href: "/shop", external: false },
  { label: "WhatsApp", href: "https://wa.me/+5493794619887", external: true },
  { label: "Administración", href: "/admin", external: false },
] as const;

const MOBILE_MENU_LINKS = [
  { label: "Inicio", href: "/", external: false, icon: Home },
  {
    label: "Agendar turno",
    href: "/appointments/new",
    external: false,
    icon: CalendarPlus,
  },
  {
    label: "Consultar turno",
    href: "/appointments/get",
    external: false,
    icon: CalendarSearch,
  },
  { label: "Tienda", href: "/shop", external: false, icon: ShoppingBag },
  {
    label: "WhatsApp",
    href: "https://wa.me/+5493794619887",
    external: true,
    icon: MessageCircle,
  },
  {
    label: "Administración",
    href: "/admin",
    external: false,
    icon: LayoutDashboard,
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (pathname === href || pathname.startsWith(href + "/")) return true;
  //TODO /appointments/[id] (detail page) → highlight "Consultar turno" quitar con template de META
  if (href === "/appointments/get") {
    const knownSubs = [
      "/appointments/new",
      "/appointments/get",
      "/appointments/update",
    ];
    return (
      pathname.startsWith("/appointments/") &&
      !knownSubs.some((s) => pathname.startsWith(s))
    );
  }
  return false;
}

type Props = {
  position?: "fixed" | "sticky";
  pageTitle?: string;
};

export function HomeNavbar({ position = "fixed", pageTitle }: Props) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    if (position !== "fixed") return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [position]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={cn(
          "h-16 flex items-center px-5 lg:px-8 transition-all duration-300 font-archivo",
          position === "fixed"
            ? "fixed top-0 left-0 right-0 z-50"
            : "sticky top-0 z-50 shrink-0",
          position === "fixed" && scrolled
            ? "backdrop-blur-md border-b border-border-subtle dark:border-zinc-800"
            : position === "fixed"
              ? "bg-transparent backdrop-blur-sm border-b border-transparent"
              : "backdrop-blur-md border-b border-border-subtle dark:border-zinc-800",
        )}
      >
        {/* ── Mobile: logo | page title | hamburger ── */}
        <div className="flex lg:hidden items-center w-full">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Luckete Colorista"
              width={22}
              height={22}
              className="object-contain dark:brightness-0 dark:invert"
              priority
            />
          </Link>
          <span className="flex-1 text-center text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-content dark:text-zinc-100 px-3 truncate">
            {pageTitle ?? "Luckete Colorista"}
          </span>
          <button
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-content-secondary dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Desktop: logo + name | links ── */}
        <Link href="/" className="hidden lg:flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.png"
            alt="Luckete Colorista"
            width={28}
            height={28}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
          <span className="font-heebo font-light text-sm tracking-[0.06em] text-content dark:text-zinc-100">
            Luckete Colorista
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-1 ml-auto">
          {DESKTOP_LINKS.map((link) => {
            const active = !link.external && isActive(link.href, pathname);
            const inner = (
              <>
                {active && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-lg bg-gold/30 dark:bg-gold/15 border border-gold/40 dark:border-gold/20"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </>
            );
            const cls = cn(
              "relative px-4 py-2 rounded-lg text-xs font-medium transition-colors",
              active
                ? "text-gold font-semibold"
                : "text-content-secondary dark:text-zinc-400 hover:bg-black/8 hover:text-content dark:hover:bg-white/8 dark:hover:text-zinc-100",
            );
            return link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={cls}>
                {inner}
              </Link>
            );
          })}
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-surface dark:bg-[#141210] border-b border-border-subtle dark:border-zinc-800 px-5 pb-6 pt-4"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ul className="space-y-1">
                {MOBILE_MENU_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active =
                    !link.external && isActive(link.href, pathname);
                  const cls = cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-gold/20 dark:bg-gold/15 text-gold border-l-2 border-gold pl-[10px] [&>svg]:text-gold font-semibold"
                      : "text-content dark:text-zinc-100 hover:bg-gold/10 hover:text-gold [&>svg]:text-content-tertiary dark:[&>svg]:text-zinc-500 hover:[&>svg]:text-gold",
                  );
                  const content = (
                    <>
                      <Icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </>
                  );
                  return (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={cls}
                          onClick={() => setMenuOpen(false)}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className={cls}
                          onClick={() => setMenuOpen(false)}
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}

                {/* Theme toggle — styled as a menu item */}
                <li>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-content dark:text-zinc-100 hover:bg-gold/10 hover:text-gold [&>svg]:text-content-tertiary dark:[&>svg]:text-zinc-500 hover:[&>svg]:text-gold transition-colors"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4 shrink-0" />
                    ) : (
                      <Moon className="w-4 h-4 shrink-0" />
                    )}
                    {isDark ? "Modo claro" : "Modo oscuro"}
                  </button>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
