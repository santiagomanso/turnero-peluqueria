import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { getAppointmentByIdAction } from "../../_actions/get-by-id";
import CreateAppointmentForm from "../../new/_components/create-appointment-form";

type Props = {
  params: Promise<{ id: string }>;
};

async function FetchAndRenderForm({ params }: Props) {
  const { id } = await params;
  const response = await getAppointmentByIdAction(id);

  if (!response.success || !response.data) {
    notFound();
  }

  // Pass the fetched appointment to the form
  return <CreateAppointmentForm appointment={response.data} />;
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
