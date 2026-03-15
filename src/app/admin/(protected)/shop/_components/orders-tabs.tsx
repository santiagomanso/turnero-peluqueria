"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getOrdersAction } from "../_actions/get-orders";
import { OrderDetailPanel } from "./order-detail-panel";
import { useAsyncData } from "../_hooks/use-async-data";
import {
  ORDER_STATUS_CONFIG,
  type Order,
  type OrderStatus,
} from "@/types/shop";

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

const STATS = [
  {
    key: "PENDING" as OrderStatus,
    label: "Pendientes",
    lightBg: "bg-amber-50",
    lightBorder: "border-amber-200",
    lightText: "text-amber-700",
    darkBg: "dark:bg-[#1c1a12]",
    darkBorder: "dark:border-[#4a3d1a]",
    darkText: "dark:text-[#d4a843]",
  },
  {
    key: "PROCESSING" as OrderStatus,
    label: "Preparando",
    lightBg: "bg-blue-50",
    lightBorder: "border-blue-200",
    lightText: "text-blue-700",
    darkBg: "dark:bg-blue-950/20",
    darkBorder: "dark:border-blue-900/40",
    darkText: "dark:text-blue-400",
  },
  {
    key: "READY" as OrderStatus,
    label: "Para retirar",
    lightBg: "bg-purple-50",
    lightBorder: "border-purple-200",
    lightText: "text-purple-700",
    darkBg: "dark:bg-purple-950/20",
    darkBorder: "dark:border-purple-900/40",
    darkText: "dark:text-purple-400",
  },
  {
    key: "PICKED_UP" as OrderStatus,
    label: "Retirados",
    lightBg: "bg-green-50",
    lightBorder: "border-green-200",
    lightText: "text-green-700",
    darkBg: "dark:bg-green-950/20",
    darkBorder: "dark:border-green-900/40",
    darkText: "dark:text-green-400",
  },
];

export function OrderesTab() {
  const {
    data: orders,
    setData: setOrders,
    isLoading,
  } = useAsyncData<Order>(getOrdersAction, "orders");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "todos">(
    "todos",
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      (o.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleUpdateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
          Cargando órdenes...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Stats — 2x2 mobile, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s) => {
            const count = orders.filter((o) => o.status === s.key).length;
            return (
              <div
                key={s.key}
                className={cn(
                  "rounded-xl p-3 sm:p-4 flex flex-col gap-1 border",
                  s.lightBg,
                  s.lightBorder,
                  s.darkBg,
                  s.darkBorder,
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium leading-tight",
                    s.lightText,
                    s.darkText,
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn("text-2xl font-bold", s.lightText, s.darkText)}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <Search
              size={15}
              className="text-content-tertiary dark:text-zinc-500 shrink-0"
            />
            <input
              className="flex-1 bg-transparent text-sm outline-none text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500"
              placeholder="Buscar por cliente o N° de orden..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none w-full sm:w-auto rounded-lg border border-border-subtle dark:border-zinc-700 px-3 py-2 pr-8 text-sm cursor-pointer outline-none bg-white dark:bg-zinc-900 text-content dark:text-zinc-100"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as OrderStatus | "todos")
              }
            >
              <option value="todos">Todos los estados</option>
              {Object.entries(ORDER_STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-content-tertiary dark:text-zinc-500"
            />
          </div>
        </div>

        {/* Table desktop */}
        <div className="hidden md:block rounded-xl overflow-hidden border border-border-subtle dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800 border-b border-border-subtle dark:border-zinc-700">
                {[
                  "Orden",
                  "Cliente",
                  "Fecha",
                  "Productos",
                  "Total",
                  "Estado",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold tracking-wide text-content-tertiary dark:text-zinc-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className={cn(
                    "transition-colors hover:bg-surface dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900",
                    i < filtered.length - 1 &&
                      "border-b border-border-subtle dark:border-zinc-700",
                  )}
                >
                  <td className="px-4 py-3 font-mono font-semibold text-xs text-gold">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-content dark:text-zinc-100">
                      {order.name ?? "Sin nombre"}
                    </div>
                    <div className="text-xs text-content-tertiary dark:text-zinc-500">
                      {order.email ?? order.telephone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-content-secondary dark:text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-medium text-content-secondary dark:text-zinc-400">
                    {order.items.length}
                  </td>
                  <td className="px-4 py-3 font-semibold text-content dark:text-zinc-100">
                    ${order.total.toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={13} />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center bg-white dark:bg-zinc-900">
              <ShoppingBag
                size={32}
                className="mx-auto mb-3 opacity-25 text-content-tertiary dark:text-zinc-500"
              />
              <p className="text-sm text-content-tertiary dark:text-zinc-500">
                No se encontraron órdenes
              </p>
            </div>
          )}
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <ShoppingBag
                size={32}
                className="mx-auto mb-3 opacity-25 text-content-tertiary dark:text-zinc-500"
              />
              <p className="text-sm text-content-tertiary dark:text-zinc-500">
                No se encontraron órdenes
              </p>
            </div>
          )}
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-border-subtle dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900"
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-semibold text-xs shrink-0 text-gold">
                    #{order.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium truncate text-content dark:text-zinc-100">
                    {order.name ?? "Sin nombre"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={order.status} />
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200 text-content-tertiary dark:text-zinc-500",
                      expandedId === order.id ? "rotate-180" : "",
                    )}
                  />
                </div>
              </button>
              {expandedId === order.id && (
                <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-border-subtle dark:border-zinc-700">
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-content-tertiary dark:text-zinc-500">
                      Fecha
                    </span>
                    <span className="text-content-secondary dark:text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-content-tertiary dark:text-zinc-500">
                      Productos
                    </span>
                    <span className="text-content-secondary dark:text-zinc-400">
                      {order.items.length} ítem
                      {order.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-content-tertiary dark:text-zinc-500">
                      Total
                    </span>
                    <span className="text-content dark:text-zinc-100">
                      ${order.total.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-1 bg-gold text-white hover:bg-gold/90"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={14} />
                    Ver detalle de la orden
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={orders.find((o) => o.id === selectedOrder.id) ?? selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </>
  );
}
