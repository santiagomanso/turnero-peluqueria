import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import CreateAppointmentForm from "./_components/create-appointment-form";

export default function CreateAppointmentPage() {
  return (
    <Container.wrapper>
      <Container.content className="space-y-5">
        <Navbar title="Nuevo Turno" />
        <CreateAppointmentForm />
      </Container.content>
    </Container.wrapper>
  );
}
