import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import GetAppointments from "./_components/get-appointments";

export default function SearchAppointmentPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <HomeNavbar position="sticky" pageTitle="Consultar Turno" />
      <GetAppointments />
    </div>
  );
}
