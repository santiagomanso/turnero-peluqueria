import { getConfig } from "@/services/config";
import CreateAppointmentForm from "./create-appointment-form";

export default async function CreateAppointmentView() {
  const config = await getConfig();
  const bookingCost = config?.bookingCost ?? 0;

  return <CreateAppointmentForm bookingCost={bookingCost} />;
}
