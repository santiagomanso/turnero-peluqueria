"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Appointment } from "@/types/appointment";

type Props = {
  appointment: Appointment;
  onDelete?: (id: string) => void;
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 shrink-0 text-gold" />
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-content-quaternary mb-0.5">
          {label}
        </p>
        <p className="font-medium text-sm text-content">{value}</p>
      </div>
    </div>
  );
}

export default function AppointmentCard({ appointment, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

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
      <div className="bg-white rounded-xl border border-border-subtle shadow shadow-neutral-400 p-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <InfoRow
              icon={Calendar}
              label="Fecha"
              value={format(appointment.date, "d 'de' MMMM", { locale: es })}
            />
            <InfoRow icon={Clock} label="Hora" value={appointment.time} />
          </div>

          <InfoRow
            icon={Phone}
            label="Teléfono"
            value={appointment.telephone}
          />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/appointments/update/${appointment.id}`}
              className="w-full"
            >
              <Button
                variant="default"
                className="w-full text-xs font-semibold uppercase tracking-[0.08em] bg-black/4! border border-border-subtle shadow-none hover:bg-black/8! transition-all text-content-secondary"
              >
                <Edit className="w-3 h-3 mr-1.5 " />
                Modificar
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isDeleting}
                  className="text-xs font-semibold uppercase tracking-[0.08em] border border-red-500 transition-all bg-linear-to-br from-rose-400/70 to-red-800 text-white"
                >
                  <Trash2 className="w-3 h-3 mr-1.5" />
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
                    {format(appointment.date, "d 'de' MMMM", { locale: es })} a
                    las {appointment.time} será cancelado permanentemente.
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
