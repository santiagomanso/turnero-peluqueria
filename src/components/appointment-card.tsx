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

export default function AppointmentCard({ appointment, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteAppointmentAction(appointment.id);

      if (response.success) {
        toast.success("Turno cancelado correctamente");

        // Trigger slide-out animation
        setIsRemoving(true);

        // Wait for animation to complete before removing from state
        setTimeout(() => {
          if (onDelete) {
            onDelete(appointment.id);
          }
        }, 300); // Match animation duration
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
      <div className="shadow-md shadow-indigo-950 bg-white/5 rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white/70" />
              <div>
                <p className="text-white/70 text-xs">Fecha</p>
                <p className="text-white font-semibold">
                  {format(appointment.date, "d 'de' MMMM", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/70" />
              <div>
                <p className="text-white/70 text-xs">Hora</p>
                <p className="text-white font-semibold">{appointment.time}</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-white/70" />
            <div>
              <p className="text-white/70 text-xs">Teléfono</p>
              <p className="text-white font-semibold">
                {appointment.telephone}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href={`/appointments/update/${appointment.id}`}
              className="w-full"
            >
              <Button
                variant="default"
                className="w-full px-4 py-3 font-semibold transition-all bg-black/20 border border-white/30 text-white hover:bg-white/30"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modificar
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isDeleting}
                  className="border-white/30 bg-linear-to-br from-red-400/80 via-pink-800 to-rose-950 border"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-linear-to-br from-fuchsia-950 to-purple-900 border-white/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white text-xl">
                    ¿Cancelar turno?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    Esta acción no se puede deshacer. El turno para el{" "}
                    {format(appointment.date, "d 'de' MMMM", { locale: es })} a
                    las {appointment.time} será cancelado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    No, mantener
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-linear-to-br from-red-500 to-rose-700 text-white hover:from-red-600 hover:to-rose-800"
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
