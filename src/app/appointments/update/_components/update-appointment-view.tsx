import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { getAppointmentByIdAction } from "../../_actions/get-by-id";
import CreateAppointmentForm from "../../new/_components/create-appointment-form";
import { PastAppointmentGuard } from "./past-appointment-guard";

const TZ = "America/Argentina/Buenos_Aires";

type Props = {
  params: Promise<{ id: string }>;
};

async function FetchAndRenderForm({ params }: Props) {
  const { id } = await params;
  const response = await getAppointmentByIdAction(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const appointment = response.data;

  // Block editing past appointments
  const today = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
  const apptDate = formatInTimeZone(new Date(appointment.date), TZ, "yyyy-MM-dd");
  if (apptDate < today) {
    return <PastAppointmentGuard />;
  }

  return <CreateAppointmentForm appointment={appointment} />;
}

export default function UpdateAppointmentView({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      }
    >
      <FetchAndRenderForm params={params} />
    </Suspense>
  );
}
