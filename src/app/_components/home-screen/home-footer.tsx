import Link from "next/link";
import { Instagram } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="bg-[#0e0d0b] border-t border-white/6 py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
        {/* Brand */}
        <div>
          <p className="font-heebo font-light text-sm tracking-[0.06em] text-zinc-300">
            Luckete Colorista
          </p>
          <p className="font-archivo text-micro tracking-[0.22em] uppercase text-gold mt-1">
            Donde el color se vuelve arte
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-linear-to-r from-transparent via-gold/50 to-transparent" />

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/appointments/new"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors tracking-wide"
          >
            Agendar turno
          </Link>
          <Link
            href="/appointments/get"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors tracking-wide"
          >
            Consultar turno
          </Link>
          <Link
            href="/shop"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors tracking-wide"
          >
            Tienda
          </Link>
          <a
            href="https://wa.me/+5493794619887"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors tracking-wide"
          >
            WhatsApp
          </a>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-zinc-600">
          <span>© 2026 Todos los derechos reservados</span>
          <span className="hidden sm:block text-zinc-700">·</span>
          <span>
            Desarrollado por{" "}
            <a
              href="https://santiago-manso.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
            >
              santiago manso
            </a>
          </span>
          <span className="hidden sm:block text-zinc-700">·</span>
          <a
            href="https://instagram.com/santiago_manso"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Instagram size={12} strokeWidth={1.8} />
            @santiago_manso
          </a>
        </div>
      </div>
    </footer>
  );
}
