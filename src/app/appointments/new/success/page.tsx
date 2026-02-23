import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AppointmentSuccessPage() {
  return (
    <Container.wrapper>
      <Container.content className="space-y-5">
        <Navbar title="Turno Confirmado" />
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-8 flex flex-col items-center text-center gap-4">
          <CheckCircle className="w-16 h-16 text-gold" />
          <div>
            <h2 className="text-2xl font-bold text-content">¡Turno creado!</h2>
            <p className="text-sm text-content-tertiary mt-1">
              Tu turno fue reservado y el pago procesado correctamente.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 hover:bg-gold/90 transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
