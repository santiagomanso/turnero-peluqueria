"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Store,
  CreditCard,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/shop/_store/use-cart";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  const clearCart = useCart((s) => s.clearCart);
  const lastOrder = useCart((s) => s.lastOrder);

  const isLocal = method === "local";

  React.useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total =
    lastOrder?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-5 py-10 text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring" as const,
          stiffness: 400,
          damping: 20,
          delay: 0.15,
        }}
        className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center"
      >
        <CheckCircle2
          className="w-10 h-10 text-emerald-500"
          strokeWidth={1.5}
        />
      </motion.div>

      <div>
        <h1 className="text-xl font-extrabold text-content dark:text-zinc-100 mb-1">
          {isLocal ? "Pedido registrado" : "Pago confirmado"}
        </h1>
        <p className="text-sm text-content-tertiary dark:text-zinc-500 max-w-70">
          {isLocal
            ? "Tu pedido fue registrado. Te contactaremos por WhatsApp cuando esté listo para retirar."
            : "Tu pago fue procesado correctamente. Te avisaremos por WhatsApp cuando tu pedido esté listo."}
        </p>
      </div>

      {/* Payment method badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
          isLocal
            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
            : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
        }`}
      >
        {isLocal ? (
          <Store className="w-4 h-4" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {isLocal ? "Pago en el local" : "Pagado con MercadoPago"}
      </div>

      {/* Order ID */}
      {orderId && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-[0.6rem] uppercase tracking-widest text-content-quaternary dark:text-zinc-600">
            Número de pedido
          </p>
          <span className="font-mono font-bold text-gold text-lg">
            #{orderId.slice(-8).toUpperCase()}
          </span>
        </div>
      )}

      {/* Products list */}
      {lastOrder && lastOrder.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl border border-border-subtle dark:border-zinc-800 overflow-hidden"
        >
          <div className="bg-surface dark:bg-zinc-800 px-4 py-2.5 border-b border-border-subtle dark:border-zinc-700">
            <p className="text-[0.65rem] uppercase tracking-widest text-content-quaternary dark:text-zinc-500 text-left">
              Productos
            </p>
          </div>
          {lastOrder.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < lastOrder.length - 1
                  ? "border-b border-border-subtle dark:border-zinc-800"
                  : ""
              } ${i % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-surface/50 dark:bg-zinc-800/50"}`}
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-gold" />
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-content dark:text-zinc-100 truncate">
                  {item.name}
                </p>
                <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-600">
                  x{item.quantity}
                </p>
              </div>
              <p className="text-xs font-semibold text-content dark:text-zinc-100 shrink-0">
                ${(item.price * item.quantity).toLocaleString("es-AR")}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-t border-border-subtle dark:border-zinc-700">
            <span className="text-xs font-bold text-content dark:text-zinc-100">
              Total
            </span>
            <span className="text-sm font-bold text-gold">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
        </motion.div>
      )}

      {/* Back to shop */}
      <Button asChild variant="outline" className="mt-2 rounded-xl">
        <Link href="/shop" className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Volver a la tienda
        </Link>
      </Button>
    </motion.div>
  );
}
