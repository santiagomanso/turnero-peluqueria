"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "../_store/use-cart";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";

// ─── Category emoji lookup ─────────────────────────────────────────────────────

const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador": "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares": "✨",
  "Aceites y Serums": "🌿",
  "Protectores y Sprays": "💨",
  "Cremas para Peinar": "🪄",
  Accesorios: "🪮",
};

function categoryEmoji(cat: string) {
  return CATEGORY_EMOJI[cat as ShopCategory] ?? "📦";
}

// ─── Single cart item row ──────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);

  const subtotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="flex items-center gap-3 py-3 border-b border-border-subtle dark:border-zinc-800 last:border-0"
    >
      {/* Image / emoji */}
      <div className="w-14 h-14 rounded-xl bg-surface dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl select-none">{categoryEmoji(item.category)}</span>
        )}
      </div>

      {/* Name + controls */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-content dark:text-zinc-100 leading-tight truncate">
          {item.name}
        </p>
        <p className="text-[0.6rem] text-content-tertiary dark:text-zinc-500 mt-0.5">
          ${item.price.toLocaleString("es-AR")} c/u
        </p>

        {/* Quantity stepper */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => decrement(item.id)}
            className="w-6 h-6 rounded-full border border-border-subtle dark:border-zinc-700 flex items-center justify-center text-content-tertiary dark:text-zinc-400 hover:border-gold hover:text-gold transition-colors active:scale-90"
            aria-label="Reducir cantidad"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-extrabold text-content dark:text-zinc-100 min-w-[1.25rem] text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => increment(item.id)}
            className="w-6 h-6 rounded-full border border-border-subtle dark:border-zinc-700 flex items-center justify-center text-content-tertiary dark:text-zinc-400 hover:border-gold hover:text-gold transition-colors active:scale-90"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-extrabold text-content dark:text-zinc-100 tabular-nums">
          ${subtotal.toLocaleString("es-AR")}
        </span>
        <button
          onClick={() => remove(item.id)}
          className="text-content-quaternary dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors active:scale-90"
          aria-label="Eliminar del carrito"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-surface dark:bg-zinc-800 flex items-center justify-center">
        <ShoppingBag className="w-8 h-8 text-content-quaternary dark:text-zinc-600" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-content dark:text-zinc-100">
        Tu carrito está vacío
      </p>
      <p className="text-xs text-content-tertiary dark:text-zinc-500 max-w-[200px]">
        Explorá nuestros productos y agregá los que te gusten
      </p>
      <button
        onClick={onClose}
        className="mt-1 text-xs font-semibold text-gold hover:underline"
      >
        Ver productos
      </button>
    </div>
  );
}

// ─── Cart drawer ───────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const totalPrice = useCart((s) => s.totalPrice);
  const totalItems = useCart((s) => s.totalItems);

  const total = totalPrice();
  const count = totalItems();
  const isEmpty = items.length === 0;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && closeCart()}
      direction="right"
    >
      <DrawerContent className="flex flex-col w-full sm:max-w-md">
        {/* Header */}
        <DrawerHeader className="border-b border-border-subtle dark:border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gold" strokeWidth={1.5} />
              <DrawerTitle className="text-lg font-extrabold text-content dark:text-zinc-100">
                Carrito
              </DrawerTitle>
              {count > 0 && (
                <span className="text-[0.6rem] font-extrabold bg-gold text-white px-2 py-0.5 rounded-full tabular-nums">
                  {count}
                </span>
              )}
            </div>
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="text-[0.65rem] text-content-quaternary dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
              >
                Vaciar
              </button>
            )}
          </div>
        </DrawerHeader>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-4">
          {isEmpty ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer — total + checkout CTA */}
        {!isEmpty && (
          <DrawerFooter className="border-t border-border-subtle dark:border-zinc-800 gap-3 pt-4">
            {/* Total breakdown */}
            <div className="flex items-center justify-between text-sm px-1">
              <span className="text-content-tertiary dark:text-zinc-400 font-medium">
                Total ({count} {count === 1 ? "producto" : "productos"})
              </span>
              <span className="text-xl font-extrabold text-content dark:text-zinc-100 tabular-nums">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>

            {/* Checkout button */}
            <DrawerClose asChild>
              <Button
                asChild
                className="w-full bg-gold hover:bg-gold/90 text-white font-bold text-sm h-12 rounded-xl"
              >
                <Link href="/shop/checkout">
                  Pagar ${total.toLocaleString("es-AR")}
                </Link>
              </Button>
            </DrawerClose>

            {/* Keep shopping */}
            <DrawerClose asChild>
              <button className="text-xs text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300 transition-colors text-center">
                Seguir comprando
              </button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
