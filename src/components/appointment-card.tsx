"use client";

import {
  Calendar,
  Clock,
  Phone,
  Edit,
  Trash2,
  DollarSign,
  Check,
  MoreHorizontal,
  MessageCircle,
  Scissors,
  Store,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateFromISO, formatDateISO } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
import { regeneratePaymentLinkAction } from "@/app/admin/_actions/regenerate-payment-link";
import type { Appointment } from "@/types/appointment";
import { AppointmentStatus } from "@prisma/client";

type Props = {
  appointment: Appointment;
  onDelete?: (id: string) => void;
  publicView?: boolean;
};

function StatusLabel({ status }: { status: AppointmentStatus }) {
  if (status === "PAID")
    return (
      <span className="flex items-center gap-2">
        <Check className="w-3 h-3" />
        Pagado
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="flex items-center gap-2">
        <Clock className="w-3 h-3" />
        Pendiente
      </span>
    );
  return (
    <span className="flex items-center gap-2">
      <Trash2 className="w-3 h-3" />
      Cancelado
    </span>
  );
}

function toUTCDateOnly(date: Date | string): string {
  if (typeof date === "string") return date.slice(0, 10);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER;

export default function AppointmentCard({
  appointment,
  onDelete,
  publicView = false,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [status, setStatus] = useState<AppointmentStatus>(appointment.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const price = appointment.price
    ? `$${appointment.price.toLocaleString("es-AR")}`
    : "$0";

  const shortPhone = appointment.telephone.slice(-10);
  const shortId = appointment.id.slice(-6).toUpperCase();
  const WHATSAPP_TEXT = encodeURIComponent(
    `Hola! Quiero modificar mi turno #${appointment.id}`,
  );

  const displayName =
    appointment.payerName ?? appointment.payerEmail ?? "Sin nombre";
  const truncatedName =
    displayName.length > 20 ? displayName.slice(0, 20) + "…" : displayName;

  const dateISO = toUTCDateOnly(appointment.date);
  const dateFormatted = formatDateFromISO(dateISO);
  const todayISO = formatDateISO(new Date());
  const isAppointmentToday = dateISO === todayISO;

  const dateLabel = isAppointmentToday
    ? `de HOY ${dateFormatted}`
    : `del ${dateFormatted}`;

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (newStatus === status) return;
    setIsUpdatingStatus(true);
    setStatus(newStatus);
    const result = await updateAppointmentStatusAction(
      appointment.id,
      newStatus,
    );
    if (!result.success) {
      setStatus(status);
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
        setStatus(AppointmentStatus.CANCELLED);
        if (onDelete) {
          setIsRemoving(true);
          setTimeout(() => onDelete(appointment.id), 300);
        }
      } else {
        toast.error(response.error ?? "Error al cancelar el turno");
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendPaymentLink = async () => {
    let url = appointment.paymentUrl;

    if (!url) {
      toast.loading("Generando link de pago...", { id: "payment-link" });
      const result = await regeneratePaymentLinkAction(appointment.id);
      toast.dismiss("payment-link");
      if (!result.success || !result.paymentUrl) {
        toast.error(result.error ?? "No se pudo generar el link");
        return;
      }
      url = result.paymentUrl;
    }

    const message = encodeURIComponent(
      `Hola! Te escribimos desde *Luckete Colorista*\n\nAcá tenés el link para pagar tu turno ${dateLabel} a las ${appointment.time} hs:\n${url}`,
    );
    window.open(
      `https://wa.me/${appointment.telephone}?text=${message}`,
      "_blank",
    );
  };

  const ActionsMenu = () => (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 dark:bg-zinc-900 dark:border-zinc-800"
        >
          {!publicView && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-xs cursor-pointer gap-2">
                  <StatusLabel status={status} />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="dark:bg-zinc-900 dark:border-zinc-800">
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(AppointmentStatus.PAID)}
                    disabled={isUpdatingStatus}
                    className="text-xs gap-2 cursor-pointer"
                  >
                    {status === "PAID" ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3" />
                    )}
                    Pagado
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusChange(AppointmentStatus.PENDING)
                    }
                    disabled={isUpdatingStatus}
                    className="text-xs gap-2 cursor-pointer"
                  >
                    {status === "PENDING" ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="w-3" />
                    )}
                    Pendiente
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="dark:bg-zinc-800" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-xs cursor-pointer gap-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Enviar WhatsApp
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="dark:bg-zinc-900 dark:border-zinc-800">
                  <a
                    href={`https://wa.me/${appointment.telephone}?text=${encodeURIComponent(`👋 ¡Hola! Te escribimos desde\n💇‍♀️ *Luckete Colorista* por tu turno ${dateLabel} a las ${appointment.time} hs.`)}%0A%0A`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                      <Scissors className="w-3.5 h-3.5 shrink-0" />
                      Sobre el turno
                    </DropdownMenuItem>
                  </a>
                  <a
                    href={`https://wa.me/${appointment.telephone}?text=${encodeURIComponent("👋 ¡Hola! Te escribimos desde\n💇‍♀️ *Luckete Colorista*.")}%0A%0A`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                      <Store className="w-3.5 h-3.5 shrink-0" />
                      Desde Luckete
                    </DropdownMenuItem>
                  </a>
                  <a
                    href={`https://wa.me/${appointment.telephone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      General
                    </DropdownMenuItem>
                  </a>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="dark:bg-zinc-800" />
              {status === "PENDING" && (
                <DropdownMenuItem
                  onClick={handleSendPaymentLink}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Enviar link de pago
                </DropdownMenuItem>
              )}
              {status === "PENDING" && (
                <DropdownMenuSeparator className="dark:bg-zinc-800" />
              )}
            </>
          )}

          {publicView ? (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                <Edit className="w-3.5 h-3.5" />
                Modificar turno
              </DropdownMenuItem>
            </a>
          ) : (
            <Link href={`/appointments/update/${appointment.id}`}>
              <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
                <Edit className="w-3.5 h-3.5" />
                Modificar turno
              </DropdownMenuItem>
            </Link>
          )}

          {!publicView && status === "CANCELLED" && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(AppointmentStatus.PENDING)}
              disabled={isUpdatingStatus}
              className="text-xs gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reactivar turno
            </DropdownMenuItem>
          )}
          {!publicView && status !== "CANCELLED" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-xs gap-2 cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Cancelar turno
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {!publicView && (
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-content dark:text-zinc-100">
              ¿Cancelar turno?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-content-tertiary dark:text-zinc-500">
              El turno para el {dateFormatted} a las {appointment.time} será
              marcado como cancelado. Podés reactivarlo después si es necesario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white! dark:bg-zinc-800! border border-border-subtle dark:border-zinc-700 text-content-secondary dark:text-zinc-400 hover:bg-black/5! dark:hover:bg-zinc-700!">
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
      )}
    </AlertDialog>
  );

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
      {/* ── MOBILE ── */}
      <div
        className={cn(
          "sm:hidden rounded-xl border overflow-hidden flex",
          status === "CANCELLED"
            ? "border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50"
            : "border-border-subtle dark:border-zinc-700 shadow shadow-neutral-400/20 dark:shadow-none bg-white dark:bg-zinc-800",
        )}
      >
        {status === "PENDING" && (
          <div className="w-0.75 shrink-0 bg-amber-500" />
        )}

        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Top bar: Hora | Nombre | Menú */}
          <div
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 border-b border-border-subtle dark:border-zinc-700",
              status === "CANCELLED"
                ? "bg-zinc-100 dark:bg-zinc-800/80"
                : "bg-gray-100 dark:bg-black/30",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0",
                status === "CANCELLED" && "opacity-40",
              )}
            >
              <span className="text-[0.65rem] font-bold text-gold font-heebo leading-none">
                {appointment.time}
              </span>
            </div>
            <div className="flex-1 mx-3 flex items-center justify-center gap-1.5 min-w-0">
              <p
                className={cn(
                  "text-xs font-semibold truncate",
                  status === "CANCELLED"
                    ? "text-content-tertiary dark:text-zinc-500 line-through"
                    : "text-content dark:text-zinc-100",
                )}
              >
                {truncatedName}
              </p>
              {appointment.isTest && (
                <span className="shrink-0 text-[0.5rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  Test
                </span>
              )}
            </div>
            <ActionsMenu />
          </div>

          {/* Body */}
          <div className={cn("p-3.5", status === "CANCELLED" && "opacity-40")}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Calendar className="w-2.5 h-2.5 text-content-tertiary dark:text-zinc-500" />
                  <span className="text-[0.55rem] uppercase tracking-widest text-content-quaternary dark:text-zinc-600">
                    Fecha
                  </span>
                </div>
                <p className="text-sm font-semibold text-content dark:text-zinc-100">
                  {dateFormatted}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-0.5">
                  <span className="text-[0.55rem] uppercase tracking-widest text-content-quaternary dark:text-zinc-600">
                    Turno
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-content-tertiary dark:text-zinc-500"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gold">#{shortId}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Phone className="w-2.5 h-2.5 text-content-tertiary dark:text-zinc-500" />
                  <span className="text-[0.55rem] uppercase tracking-widest text-content-quaternary dark:text-zinc-600">
                    Teléfono
                  </span>
                </div>
                <p className="text-sm font-semibold text-content dark:text-zinc-100">
                  {shortPhone}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-0.5">
                  <span className="text-[0.55rem] uppercase tracking-widest text-content-quaternary dark:text-zinc-600">
                    Monto
                  </span>
                  <DollarSign className="w-2.5 h-2.5 text-content-tertiary dark:text-zinc-500" />
                </div>
                <p className="text-sm font-semibold text-content dark:text-zinc-100">
                  {price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div
        className={cn(
          "hidden sm:flex rounded-xl border overflow-hidden items-stretch gap-4",
          status === "CANCELLED"
            ? "border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50"
            : "border-border-subtle dark:border-zinc-700 shadow shadow-neutral-400/20 dark:shadow-none bg-white dark:bg-zinc-800",
        )}
      >
        {status === "PENDING" && (
          <div className="w-0.75 self-stretch shrink-0 bg-amber-500" />
        )}
        <div
          className={cn(
            "w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 self-center",
            status === "PENDING" ? "ml-3" : "ml-4",
            status === "CANCELLED" && "opacity-40",
          )}
        >
          <span className="text-xs font-bold text-gold font-heebo leading-none">
            {appointment.time}
          </span>
        </div>

        <div
          className={cn(
            "flex-1 min-w-0 py-3",
            status === "CANCELLED" && "opacity-40",
          )}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <p
              className={cn(
                "text-sm font-semibold font-heebo truncate",
                status === "CANCELLED"
                  ? "text-content-tertiary dark:text-zinc-500 line-through"
                  : "text-content dark:text-zinc-100",
              )}
            >
              {displayName}
            </p>
            {appointment.isTest && (
              <span className="shrink-0 text-[0.5rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                Test
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-content-tertiary dark:text-zinc-500">
            <Calendar className="w-3 h-3" />
            <span>{dateFormatted}</span>
            <span className="text-content-quaternary dark:text-zinc-700">
              ·
            </span>
            <span>{appointment.time}</span>
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 self-center text-right",
            status === "CANCELLED" && "opacity-40",
          )}
        >
          <p
            className={cn(
              "text-sm font-bold font-heebo",
              status === "CANCELLED"
                ? "text-content-tertiary dark:text-zinc-500"
                : "text-content dark:text-zinc-100",
            )}
          >
            {shortPhone}
          </p>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            {price}
          </p>
        </div>

        <div className="pr-4 self-center">
          <ActionsMenu />
        </div>
      </div>
    </motion.div>
  );
}
