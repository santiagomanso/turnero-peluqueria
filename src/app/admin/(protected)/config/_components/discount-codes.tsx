"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  Trash2,
  TicketPercent,
  Copy,
  Check,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DiscountCode } from "@/types/config";

function generateCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++)
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

function getCodeStatus(code: DiscountCode): "active" | "scheduled" | "expired" {
  const now = new Date();
  if (now < code.validFrom) return "scheduled";
  if (now > code.validUntil) return "expired";
  return "active";
}

const STATUS_MAP = {
  active: {
    label: "Activo",
    className:
      "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  scheduled: {
    label: "proximamente",
    className:
      "bg-[#e0f2fe] dark:bg-[#0f172a] text-[#0369a1] dark:text-[#7dd3fc] border-[#7dd3fc] dark:border-[#0369a1]",
  },
  expired: {
    label: "vencido",
    className:
      "bg-black/5 dark:bg-zinc-800 text-content-tertiary dark:text-zinc-500 border-border-subtle dark:border-zinc-700",
  },
};

// ── DatePicker ────────────────────────────────────────────────────────

function DatePicker({
  date,
  onSelect,
  placeholder,
  fromDate,
}: {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder: string;
  fromDate?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full justify-start gap-2 text-left font-normal",
            !date && "text-content-tertiary",
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          {date ? format(date, "dd MMM yyyy", { locale: es }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-700 shadow-lg rounded-xl"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            setOpen(false);
          }}
          fromDate={fromDate}
          locale={es}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// ── CreateDiscountDialog ──────────────────────────────────────────────

function CreateDiscountDialog({
  onCreated,
}: {
  onCreated: (code: DiscountCode) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [newCode, setNewCode] = React.useState("");
  const [newDiscount, setNewDiscount] = React.useState(5);
  const [newFrom, setNewFrom] = React.useState<Date | undefined>();
  const [newUntil, setNewUntil] = React.useState<Date | undefined>();

  const resetForm = () => {
    setNewCode(generateCode());
    setNewDiscount(5);
    setNewFrom(undefined);
    setNewUntil(undefined);
  };

  const canCreate =
    newCode.trim().length >= 3 &&
    newDiscount >= 5 &&
    newDiscount <= 100 &&
    newFrom !== undefined &&
    newUntil !== undefined &&
    newFrom < newUntil;

  const handleCreate = () => {
    if (!canCreate || !newFrom || !newUntil) return;
    onCreated({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      code: newCode.toUpperCase().trim(),
      discount: newDiscount,
      validFrom: newFrom,
      validUntil: newUntil,
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) resetForm();
        setOpen(o);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 bg-zinc-700 dark:bg-zinc-800 text-zinc-100 hover:bg-zinc-600 dark:hover:bg-zinc-700 border border-zinc-600 dark:border-zinc-700 shadow-none"
        >
          <Plus className="w-3.5 h-3.5" />
          Nuevo Código
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
            Crear Código de Descuento
          </DialogTitle>
          <DialogDescription className="text-xs text-content-tertiary dark:text-zinc-500">
            Genera un nuevo código promocional con porcentaje de descuento y
            fechas de validez.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Código */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-content dark:text-zinc-100">
              Código
            </Label>
            <div className="flex items-center gap-2">
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="CODIGO10"
                className="font-mono uppercase"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNewCode(generateCode())}
                className="shrink-0 text-xs"
              >
                Generar
              </Button>
            </div>
          </div>

          {/* Descuento */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm ">Descuento</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={newDiscount <= 5}
                onClick={() => setNewDiscount((prev) => Math.max(5, prev - 5))}
              >
                <span className="text-content dark:text-zinc-100 font-semibold text-xl">
                  -
                </span>
              </Button>
              <div className="flex min-w-18 flex-col items-center">
                <span className="text-2xl font-bold font-mono tabular-nums text-content dark:text-zinc-100">
                  {newDiscount}%
                </span>
                {newDiscount === 100 && (
                  <span className="text-[10px] font-medium uppercase tracking-wider text-gold">
                    Gratis
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={newDiscount >= 100}
                onClick={() =>
                  setNewDiscount((prev) => Math.min(100, prev + 5))
                }
              >
                <span className="text-content-secondary dark:text-zinc-100 font-semibold text-md">
                  +
                </span>
              </Button>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${newDiscount}%` }}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-content dark:text-zinc-100">
                Desde
              </Label>
              <DatePicker
                date={newFrom}
                onSelect={setNewFrom}
                placeholder="Fecha inicio"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-content dark:text-zinc-100">
                Hasta
              </Label>
              <DatePicker
                date={newUntil}
                onSelect={setNewUntil}
                placeholder="Fecha fin"
                fromDate={newFrom}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!canCreate}
            className="bg-gold text-white hover:bg-gold/90"
          >
            Crear Código
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── DiscountCodes ─────────────────────────────────────────────────────

interface DiscountCodesProps {
  codes: DiscountCode[];
  onAdd: (code: DiscountCode) => void;
  onDelete: (id: string) => void;
}

export function DiscountCodes({ codes, onAdd, onDelete }: DiscountCodesProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const activeCodes = codes.filter((c) => getCodeStatus(c) === "active").length;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl max-md:rounded-none border border-border-subtle max-md:border-x-0 max-md:border-b-0 dark:border-zinc-800 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-content dark:text-zinc-100">
            Códigos de Descuento
          </h2>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            <span className="max-lg:hidden">
              Crea y administra códigos promocionales para tus clientes.
            </span>
            <span className="md:hidden">Códigos promocionales.</span>
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className="text-xs text-content-tertiary dark:text-zinc-500 tabular-nums shrink-0 max-lg:hidden">
            {activeCodes} activo{activeCodes !== 1 ? "s" : ""}
          </span>
          <CreateDiscountDialog onCreated={onAdd} />
        </div>
      </div>

      {codes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gold/10">
            <TicketPercent className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-content dark:text-zinc-100">
              No hay códigos de descuento
            </p>
            <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
              Crea tu primer código promocional para empezar.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          {/* Mobile: cards */}
          <div className="flex flex-col gap-2 lg:hidden">
            {codes.map((code) => {
              const status = getCodeStatus(code);
              const dotColor =
                status === "active"
                  ? "bg-green-500"
                  : status === "scheduled"
                    ? "bg-amber-500"
                    : "bg-zinc-400 dark:bg-zinc-600";
              const statusLabel =
                status === "active"
                  ? "Activo"
                  : status === "scheduled"
                    ? "Programado"
                    : "Expirado";
              const statusPillColor =
                status === "active"
                  ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                  : status === "scheduled"
                    ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                    : "bg-black/5 dark:bg-zinc-800 text-content-tertiary dark:text-zinc-500";
              return (
                <div
                  key={code.id}
                  className="flex items-stretch gap-3 rounded-lg border border-border-subtle dark:border-zinc-800 p-3"
                >
                  <div className="min-w-15 bg-black/5 dark:bg-zinc-800 border border-black/8 dark:border-zinc-700 rounded-lg flex items-center justify-center shrink-0">
                    <span className="font-space-mono text-lg font-bold tabular-nums text-content dark:text-zinc-100 leading-none">
                      {code.discount}%
                    </span>
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0 gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-content dark:text-zinc-100 truncate">
                        {code.code}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-0.5 rounded-full shrink-0",
                          statusPillColor,
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            dotColor,
                          )}
                        />
                        <span className="text-[10px] font-semibold">
                          {statusLabel}
                        </span>
                      </span>
                    </div>
                    <div className="h-px bg-border-subtle dark:bg-zinc-800" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-content-tertiary dark:text-zinc-500">
                        {format(code.validFrom, "dd MMM", { locale: es })} —{" "}
                        {format(code.validUntil, "dd MMM yyyy", { locale: es })}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopy(code.code, code.id)}
                        >
                          {copiedId === code.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => onDelete(code.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden lg:block rounded-lg border border-border-subtle dark:border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border-subtle dark:border-zinc-800">
                  <TableHead className="text-xs text-content-tertiary dark:text-zinc-500">
                    Código
                  </TableHead>
                  <TableHead className="text-xs text-content-tertiary dark:text-zinc-500">
                    Descuento
                  </TableHead>
                  <TableHead className="text-xs text-content-tertiary dark:text-zinc-500">
                    Válido Desde
                  </TableHead>
                  <TableHead className="text-xs text-content-tertiary dark:text-zinc-500">
                    Válido Hasta
                  </TableHead>
                  <TableHead className="text-xs text-content-tertiary dark:text-zinc-500">
                    Estado
                  </TableHead>
                  <TableHead className="text-right text-xs text-content-tertiary dark:text-zinc-500">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => {
                  const status = getCodeStatus(code);
                  const statusInfo = STATUS_MAP[status];
                  return (
                    <TableRow
                      key={code.id}
                      className="border-border-subtle dark:border-zinc-800"
                    >
                      <TableCell>
                        <span className="font-mono text-sm font-bold text-content dark:text-zinc-100">
                          {code.code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold tabular-nums text-content-secondary dark:text-zinc-500">
                          {code.discount}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-content-tertiary dark:text-zinc-500">
                          {format(code.validFrom, "dd MMM yyyy", {
                            locale: es,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-content-tertiary dark:text-zinc-500">
                          {format(code.validUntil, "dd MMM yyyy", {
                            locale: es,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                            statusInfo.className,
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopy(code.code, code.id)}
                          >
                            {copiedId === code.id ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => onDelete(code.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
