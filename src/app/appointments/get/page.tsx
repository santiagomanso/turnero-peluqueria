import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import GetAppointments from "./_components/get-appointments";

export default function SearchAppointmentPage() {
  return (
    <Container.wrapper>
      <Container.content className="max-w-2xl">
        <div className="flex flex-col h-full">
          <Navbar title="Mi Turno" />
          <div className="flex-1 min-h-0 mt-3">
            <GetAppointments />
          </div>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
