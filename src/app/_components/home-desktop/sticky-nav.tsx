"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Agendar turno", href: "/appointments/new", external: false },
  { label: "Consultar turno", href: "/appointments/get", external: false },
  { label: "Tienda", href: "/shop", external: false },
  { label: "WhatsApp", href: "https://wa.me/+5493794619887", external: true },
] as const;

export function StickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border-subtle dark:border-zinc-800"
          style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Blurred bg layer */}
          <div className="absolute inset-0 bg-surface/85 dark:bg-zinc-950/85 -z-10" />

          <span className="font-heebo font-light text-sm tracking-[0.06em] text-content dark:text-zinc-100">
            Luckete Colorista
          </span>

          <div className="flex items-center gap-1">
            {LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-medium text-content-secondary dark:text-zinc-400 hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-content-secondary dark:text-zinc-400 hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
