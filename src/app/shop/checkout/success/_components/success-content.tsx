"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Store, CreditCard, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");

  const isLocal = method === "local";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
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
        <p className="text-sm text-content-tertiary dark:text-zinc-500 max-w-[280px]">
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
        <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-600 font-mono">
          Pedido #{orderId.slice(-8).toUpperCase()}
        </p>
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
