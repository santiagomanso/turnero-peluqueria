import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import AdminAppointments from "./_components/admin-appointments";

export default function AdminPage() {
  return (
    <Container.wrapper>
      <Container.content className="max-w-2xl">
        <div className="flex flex-col h-full">
          <Navbar title="Admin" />
          <div className="flex-1 min-h-0 mt-3">
            <AdminAppointments />
          </div>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
