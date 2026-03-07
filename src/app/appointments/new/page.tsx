import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CreateAppointmentView from "./_components/create-appointment-view";

function PageSkeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-gold" />
      <p className="text-xs text-content-quaternary dark:text-zinc-600 uppercase tracking-widest">
        Cargando...
      </p>
    </div>
  );
}

export default function CreateAppointmentPage() {
  return (
    <Container.wrapper>
      <Container.content className="space-y-5">
        <Navbar title="Nuevo Turno" />
        <Suspense fallback={<PageSkeleton />}>
          <CreateAppointmentView />
        </Suspense>
      </Container.content>
    </Container.wrapper>
  );
}
