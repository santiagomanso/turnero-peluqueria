import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { getAppointmentByIdAction } from "../_actions/get-by-id";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Phone,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-md bg-white border border-border-subtle shadow-sm">
      <Icon className="w-4 h-4 shrink-0 text-gold" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-sm text-content">{value}</p>
      </div>
    </div>
  );
}

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;
  const response = await getAppointmentByIdAction(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const appointment = response.data;
  const isPaid = appointment.status === "PAID";

  return (
    <Container.wrapper>
      <Container.content className="space-y-5">
        <Navbar title="Tu Turno" />

        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-5 flex flex-col gap-4">
          {/* Status */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold ${isPaid ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}
          >
            {isPaid ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {isPaid ? "Pago confirmado" : "Pago pendiente"}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={Calendar}
              label="Fecha"
              value={format(new Date(appointment.date), "dd/MM/yyyy", {
                locale: es,
              })}
            />
            <InfoCard icon={Clock} label="Hora" value={appointment.time} />
            <InfoCard
              icon={Phone}
              label="Teléfono"
              value={`..${appointment.telephone.slice(-6)}`}
            />
            <InfoCard icon={DollarSign} label="Precio" value="$1.000 ARS" />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2">
            <Link
              href={`/appointments/update/${appointment.id}`}
              className="w-full text-center px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 hover:bg-gold/90 transition-all"
            >
              Modificar turno
            </Link>
            <Link
              href="/"
              className="w-full text-center px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-white border border-border-subtle text-content-secondary hover:bg-black/5 transition-all"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
