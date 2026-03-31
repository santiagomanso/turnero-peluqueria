import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import GetAppointments from "./_components/get-appointments";

export default function SearchAppointmentPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <HomeNavbar position="sticky" pageTitle="Consultar Turno" />
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          <GetAppointments />
        </div>
      </main>
    </div>
  );
}
