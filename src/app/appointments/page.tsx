import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import AppointmentForm from "@/components/appointment-form";

export default function Appointments() {
  return (
    <Container.wrapper>
      <Container.content>
        <Navbar />
        <div className="space-y-5 mt-5">
          <AppointmentForm />
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
