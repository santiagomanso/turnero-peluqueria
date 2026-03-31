import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import UpdateAppointmentView from "../_components/update-appointment-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default function UpdateAppointmentPage({ params }: Props) {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <HomeNavbar position="sticky" pageTitle="Editar Turno" />
      <UpdateAppointmentView params={params} />
    </div>
  );
}
