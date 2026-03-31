import Link from "next/link";
import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import { Home, CalendarCheck } from "lucide-react";

function AnimatedCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="88"
      height="88"
    >
      <style>{`
        .ap-path {
          fill: none;
          stroke: #ceaa6b;
          stroke-width: 7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .ap-circle {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: ap-draw-circle 0.6s ease-out forwards;
        }
        .ap-check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: ap-draw-check 0.4s ease-out 0.6s forwards;
        }
        .ap-container {
          animation: ap-pop 0.3s ease-out 1s both;
          transform-origin: center;
        }
        @keyframes ap-draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes ap-draw-check  { to { stroke-dashoffset: 0; } }
        @keyframes ap-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
      <g className="ap-container">
        <path className="ap-path ap-circle" d="M 62 17 A 35 35 0 1 0 81 65" />
        <path className="ap-path ap-check"  d="M 32 50 L 48 65 L 78 28" />
      </g>
    </svg>
  );
}

export default function AppointmentSuccessPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <HomeNavbar position="sticky" pageTitle="Turno Reservado" />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          {/* Animated check */}
          <div className="w-24 h-24 rounded-full bg-gold/10 dark:bg-gold/10 flex items-center justify-center">
            <AnimatedCheck />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold text-content dark:text-zinc-100">
              ¡Turno reservado!
            </h1>
            <p className="text-sm text-content-tertiary dark:text-zinc-500 max-w-[280px] mx-auto">
              Tu pago fue procesado correctamente. Te esperamos en el salón.
            </p>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gold/10 text-gold border border-gold/30">
            <CalendarCheck className="w-3.5 h-3.5" />
            Pago confirmado con MercadoPago
          </div>

          {/* WhatsApp note */}
          <p className="text-xs text-content-quaternary dark:text-zinc-600 max-w-[240px]">
            Recibirás una confirmación por WhatsApp con los detalles de tu turno.
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gold text-white hover:bg-gold/90 transition-all shadow-md shadow-gold/20"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
