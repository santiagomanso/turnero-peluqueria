"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Agendar turno",   href: "/appointments/new",           external: false },
  { label: "Consultar turno", href: "/appointments/get",           external: false },
  { label: "Tienda",          href: "/shop",                        external: false },
  { label: "WhatsApp",        href: "https://wa.me/+5493794619887", external: true  },
] as const;

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-5 lg:px-8 transition-all duration-300",
          scrolled
            ? "bg-surface/90 backdrop-blur-md border-b border-border-subtle dark:border-zinc-800"
            : "bg-transparent backdrop-blur-sm border-b border-transparent"
        )}
      >
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
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

        {/* Desktop links + toggle */}
        <div className="hidden lg:flex items-center gap-1 ml-auto">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-medium text-content-secondary dark:text-zinc-400 hover:bg-black/8 hover:text-content dark:hover:bg-white/8 dark:hover:text-zinc-100 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-xs font-medium text-content-secondary dark:text-zinc-400 hover:bg-black/8 hover:text-content dark:hover:bg-white/8 dark:hover:text-zinc-100 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto flex items-center justify-center w-9 h-9 rounded-lg text-content-secondary dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-surface dark:bg-[#141210] border-b border-border-subtle dark:border-zinc-800 px-5 pb-6 pt-4"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ul className="space-y-1 mb-5">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-content dark:text-zinc-100 hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-content dark:text-zinc-100 hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="px-3">
                <p className="text-xs text-content-secondary dark:text-zinc-300 mb-2 tracking-wide">Tema</p>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
