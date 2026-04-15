"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "../_store/use-cart";

export default function CartButton() {
  const count = useCart((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const openCart = useCart((state) => state.openCart);

  return (
    <div className="relative">
      <button
        onClick={openCart}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-black/5 dark:bg-white/8 text-content-secondary dark:text-zinc-300 hover:text-content dark:hover:text-zinc-100 transition-colors"
        aria-label="Abrir carrito"
      >
        <ShoppingCart strokeWidth={1.5} className="h-5 w-5" />
      </button>
      {count > 0 && (
        <div className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 bg-gold rounded-full flex items-center justify-center pointer-events-none">
          <span className="text-[0.5rem] text-white font-extrabold tabular-nums">
            {count > 99 ? "99+" : count}
          </span>
        </div>
      )}
    </div>
  );
}
