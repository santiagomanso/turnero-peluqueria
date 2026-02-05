import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import AppointmentForm from "./_components/appointment-form/appointment-form";

export default function Appointments() {
  return (
    <Container.wrapper>
      <Container.content className="space-y-5">
        <Navbar title="Nuevo Turno" />
        <AppointmentForm />
      </Container.content>
    </Container.wrapper>
  );
}
