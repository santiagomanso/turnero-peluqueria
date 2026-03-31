import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import CreateAppointmentView from "./_components/create-appointment-view";

function PageSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-gold" />
      <p className="text-xs text-content-quaternary dark:text-zinc-600 uppercase tracking-widest">
        Cargando...
      </p>
    </div>
  );
}

export default function CreateAppointmentPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <HomeNavbar position="sticky" pageTitle="Agendar Turno" />
      <Suspense fallback={<PageSkeleton />}>
        <CreateAppointmentView />
      </Suspense>
    </div>
  );
}
