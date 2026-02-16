import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import AppointmentSearch from "./_components/appointment-search";

export default function GetAppointment() {
  return (
    <Container.wrapper>
      <Container.content className="max-w-2xl">
        <div className="flex flex-col h-full">
          <Navbar title="Mi Turno" />
          <div className="flex-1 min-h-0 mt-3">
            <AppointmentSearch />
          </div>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
