import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import Link from "next/link";

function AnimatedCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="120"
      height="120"
    >
      <style>{`
        .path {
          fill: none;
          stroke: #ceaa6b;
          stroke-width: 8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .circle {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: draw-circle 0.6s ease-out forwards;
        }
        .check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-check 0.4s ease-out 0.6s forwards;
        }
        .container {
          animation: pop 0.3s ease-out 1s both;
          transform-origin: center;
        }
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
      <g className="container">
        <path className="path circle" d="M 62 17 A 35 35 0 1 0 81 65" />
        <path className="path check" d="M 32 50 L 48 65 L 78 28" />
      </g>
    </svg>
  );
}

export default function AppointmentSuccessPage() {
  return (
    <Container.wrapper>
      <Container.content className="space-y-5">
        <Navbar title="Turno Confirmado" />
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border-subtle dark:border-zinc-800 shadow-sm p-8 flex flex-col items-center text-center gap-4">
          <AnimatedCheckIcon />
          <div>
            <h2 className="text-2xl font-bold text-content dark:text-zinc-100">
              ¡Turno creado!
            </h2>
            <p className="text-sm text-content-tertiary dark:text-zinc-500 mt-1">
              Tu turno fue reservado y el pago procesado correctamente.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 dark:shadow-zinc-950 hover:bg-gold/90 transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
