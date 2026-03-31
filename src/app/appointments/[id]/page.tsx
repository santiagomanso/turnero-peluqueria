import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import { getAppointmentByIdAction } from "../_actions/get-by-id";
import { formatDateNumericFromISO } from "@/lib/format-date";
import { formatPhoneDisplay } from "@/lib/format-phone";
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
    <div className="flex items-center gap-3 p-3 rounded-md bg-white dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 shadow-sm">
      <Icon className="w-4 h-4 shrink-0 text-gold" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary dark:text-zinc-500 mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-sm text-content dark:text-zinc-100">
          {value}
        </p>
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
  const price = appointment.price
    ? `$${appointment.price.toLocaleString("es-AR")} ARS`
    : "$0 ARS";

  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <HomeNavbar position="sticky" pageTitle="Mi Turno" />
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-border-subtle dark:border-zinc-700 shadow-sm p-5 flex flex-col gap-4">
            {/* Status */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold ${
                isPaid
                  ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
              }`}
            >
              {isPaid ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {isPaid ? "Pago confirmado" : "Pago pendiente"}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard
                icon={Calendar}
                label="Fecha"
                value={formatDateNumericFromISO(appointment.date)}
              />
              <InfoCard icon={Clock} label="Hora" value={appointment.time} />
              <InfoCard
                icon={Phone}
                label="Teléfono"
                value={formatPhoneDisplay(appointment.telephone)}
              />
              <InfoCard icon={DollarSign} label="Precio" value={price} />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(`Hola! Quiero modificar mi turno #${appointment.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-gold text-white shadow-md shadow-neutral-300 dark:shadow-black/30 hover:bg-gold/90 transition-all"
              >
                Modificar turno
              </a>
              <Link
                href="/"
                className="w-full text-center px-6 py-3 rounded-md font-bold text-sm uppercase tracking-[0.08em] bg-white dark:bg-zinc-700 border border-border-subtle dark:border-zinc-600 text-content-secondary dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-zinc-600 transition-all"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
