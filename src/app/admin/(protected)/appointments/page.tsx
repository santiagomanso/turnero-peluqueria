import { Suspense } from "react";
import AdminAppointments from "./_components/appointments-view";

export default function AppointmentsPage() {
  return (
    <Suspense>
      <AdminAppointments />
    </Suspense>
  );
}
