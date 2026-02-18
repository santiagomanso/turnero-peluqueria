import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import UpdateAppointmentView from "../_components/update-appointment-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default function UpdateAppointmentPage({ params }: Props) {
  return (
    <Container.wrapper>
      <Container.content className="max-w-2xl">
        <Navbar title="Modificar Turno" />
        <div className="mt-3">
          <UpdateAppointmentView params={params} />
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
