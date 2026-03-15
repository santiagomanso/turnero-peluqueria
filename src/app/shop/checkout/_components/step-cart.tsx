"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/shop/_store/use-cart";
import type { CartItem } from "@/app/shop/_store/use-cart";

// ─── Cart item row ─────────────────────────────────────────────────────────────

function CartSummaryItem({ item }: { item: CartItem }) {
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, height: 0 }}
      className="flex items-center gap-3 py-3 border-b border-border-subtle dark:border-zinc-800 last:border-0"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-content dark:text-zinc-100 truncate">
          {item.name}
        </p>
        <p className="text-[0.6rem] text-content-tertiary dark:text-zinc-500">
          ${item.price.toLocaleString("es-AR")} c/u
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => decrement(item.id)}
          className="w-6 h-6 rounded-full border border-border-subtle dark:border-zinc-700 flex items-center justify-center text-content-tertiary dark:text-zinc-400 hover:border-gold hover:text-gold transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xs font-extrabold text-content dark:text-zinc-100 min-w-[1.25rem] text-center tabular-nums">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => increment(item.id)}
          className="w-6 h-6 rounded-full border border-border-subtle dark:border-zinc-700 flex items-center justify-center text-content-tertiary dark:text-zinc-400 hover:border-gold hover:text-gold transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <span className="text-sm font-extrabold text-content dark:text-zinc-100 tabular-nums w-16 text-right">
        ${(item.price * item.quantity).toLocaleString("es-AR")}
      </span>

      <button
        type="button"
        onClick={() => remove(item.id)}
        className="text-content-quaternary dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Step cart ─────────────────────────────────────────────────────────────────

export default function StepCart({
  items,
  total,
}: {
  items: CartItem[];
  total: number;
}) {
  return (
    <div className="rounded-xl border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <CartSummaryItem key={item.id} item={item} />
        ))}
      </AnimatePresence>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 mt-1">
        <span className="text-sm font-bold text-content-tertiary dark:text-zinc-400">
          Total
        </span>
        <span className="text-lg font-extrabold text-content dark:text-zinc-100 tabular-nums">
          ${total.toLocaleString("es-AR")}
        </span>
      </div>
    </div>
  );
}
