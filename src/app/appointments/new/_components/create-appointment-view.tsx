import { getConfig } from "@/services/config";
import CreateAppointmentForm from "./create-appointment-form";

export default async function CreateAppointmentView() {
  const config = await getConfig();
  const bookingCost = config?.bookingCost ?? 0;
  const daysConfig = config?.days ?? null;

  return (
    <CreateAppointmentForm bookingCost={bookingCost} daysConfig={daysConfig} />
  );
}
