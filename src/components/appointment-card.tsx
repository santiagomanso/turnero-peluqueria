"use client";

import {
  Calendar,
  Clock,
  Phone,
  Edit,
  Trash2,
  DollarSign,
  ChevronDown,
  Check,
} from "lucide-react";
import { formatDateShort } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { deleteAppointmentAction } from "@/app/appointments/_actions/delete";
import { updateAppointmentStatusAction } from "@/app/admin/_actions/update-status";
import type { Appointment } from "@/types/appointment";
import { AppointmentStatus } from "@prisma/client";

type Props = {
  appointment: Appointment;
  onDelete?: (id: string) => void;
};

function InfoRowLeft({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-3 h-3 text-gold" />
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary">
          {label}
        </p>
      </div>
      <p className="font-medium text-sm text-content">{value}</p>
    </div>
  );
}

function InfoRowRight({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-1.5 mb-0.5">
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary">
          {label}
        </p>
        <Icon className="w-3 h-3 text-gold" />
      </div>
      <p className="font-medium text-sm text-content">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const isPaid = status === "PAID";
  return (
    <span
      className={`absolute -top-2 -right-4 text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border rotate-12 shadow-sm ${
        isPaid
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      {isPaid ? "Pagado" : "Pendiente"}
    </span>
  );
}

export default function AppointmentCard({ appointment, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (newStatus === status) return;
    setIsUpdatingStatus(true);
    setStatus(newStatus);
    const result = await updateAppointmentStatusAction(
      appointment.id,
      newStatus,
    );
    if (!result.success) {
      setStatus(status); // revertir
      toast.error(result.error ?? "Error al actualizar el estado");
    }
    setIsUpdatingStatus(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteAppointmentAction(appointment.id);
      if (response.success) {
        toast.success("Turno cancelado correctamente");
        setIsRemoving(true);
        setTimeout(() => {
          if (onDelete) onDelete(appointment.id);
        }, 300);
      } else {
        toast.error(response.error ?? "Error al cancelar el turno");
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      animate={
        isRemoving
          ? { opacity: 0, x: -100, height: 0, marginBottom: 0 }
          : { opacity: 1, x: 0 }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="relative bg-white rounded-xl border border-border-subtle shadow shadow-neutral-400 p-4 overflow-visible">
        {status !== "PAID" && <StatusBadge status={status} />}

        <div className="space-y-3">
          <div className="flex justify-between">
            <InfoRowLeft
              icon={Calendar}
              label="Fecha"
              value={formatDateShort(appointment.date)}
            />
            <InfoRowRight icon={Clock} label="Hora" value={appointment.time} />
          </div>

          <div className="flex justify-between">
            <InfoRowLeft
              icon={Phone}
              label="Teléfono"
              value={appointment.telephone}
            />
            <InfoRowRight icon={DollarSign} label="Monto" value="$10.000" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isUpdatingStatus}
                  className="h-8 px-3 text-xs font-medium text-content-secondary hover:text-content hover:bg-black/5 gap-1.5"
                >
                  {status === "PAID" ? "Pagado" : "Pendiente"}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-36 bg-white border border-border-subtle shadow-md rounded-xl"
              >
                <DropdownMenuItem
                  onClick={() => handleStatusChange(AppointmentStatus.PAID)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  {status === "PAID" && <Check className="w-3 h-3 text-gold" />}
                  <span
                    className={
                      status === "PAID" ? "text-gold font-semibold" : ""
                    }
                  >
                    Pagado
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(AppointmentStatus.PENDING)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  {status === "PENDING" && (
                    <Check className="w-3 h-3 text-gold" />
                  )}
                  <span
                    className={
                      status === "PENDING" ? "text-gold font-semibold" : ""
                    }
                  >
                    Pendiente
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={`/appointments/update/${appointment.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium text-content-secondary hover:text-content hover:bg-black/5 gap-1.5"
              >
                <Edit className="w-3 h-3" />
                Modificar
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isDeleting}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium text-content-secondary hover:text-content hover:bg-black/5 gap-1.5"
                >
                  <Trash2 className="w-3 h-3 text-danger/70" />
                  Cancelar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border border-border-subtle">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl text-content">
                    ¿Cancelar turno?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-content-tertiary">
                    Esta acción no se puede deshacer. El turno para el{" "}
                    {formatDateShort(appointment.date)} a las {appointment.time}{" "}
                    será cancelado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white! border border-border-subtle text-content-secondary hover:bg-black/5!">
                    No, mantener
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-linear-to-br from-rose-400 to-red-800 border border-danger-border text-white hover:bg-danger-soft/80!"
                  >
                    {isDeleting ? "Cancelando..." : "Sí, cancelar turno"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
