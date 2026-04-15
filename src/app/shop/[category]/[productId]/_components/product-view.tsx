"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  Star,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { type ShopCategory, type Product } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { useCart } from "@/app/shop/_store/use-cart";

// Duplicated from category-view.tsx intentionally — future task: extract to shared constants
const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador": "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares": "✨",
  "Aceites y Serums": "🌿",
  "Protectores y Sprays": "💨",
  "Cremas para Peinar": "🪄",
  Accesorios: "🪮",
};

export default function ProductView({ product }: { product: Product }) {
  const added = useCart((state) =>
    state.items.some((i) => i.id === product.id),
  );
  const toggle = useCart((state) => state.toggle);
  const categorySlug = categoryToSlug(product.category as ShopCategory);
  const backHref = `/shop/${categorySlug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 28 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[0.65rem] text-content-tertiary dark:text-zinc-500 mb-3">
        <Link href="/shop" className="hover:text-gold transition-colors">
          Tienda
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={backHref} className="hover:text-gold transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content dark:text-zinc-300 font-medium truncate max-w-[180px]">
          {product.name}
        </span>
      </div>

      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-tertiary dark:text-zinc-500 hover:text-gold transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a {product.category}
      </Link>

      {/* 2-col grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start max-w-5xl">
        {/* ── Image column ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 260, damping: 24, delay: 0.05 }}
          className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/60 aspect-square flex items-center justify-center"
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-6"
            />
          ) : (
            <span className="text-9xl select-none">
              {CATEGORY_EMOJI[product.category as ShopCategory] ?? "📦"}
            </span>
          )}
          {product.featured && (
            <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-400/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              <Star className="w-3 h-3 fill-white" />
              Destacado
            </span>
          )}
        </motion.div>

        {/* ── Details column ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring" as const, stiffness: 280, damping: 26, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          {/* Name + price */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-content dark:text-zinc-100 leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl lg:text-4xl font-extrabold text-gold tabular-nums">
                ${product.price.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="w-8 h-0.5 bg-gold-gradient mt-3" />
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-content-quaternary dark:text-zinc-500 mb-2">
                Descripción
              </p>
              <p className="text-sm text-content-secondary dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Stock warning */}
          {product.stock <= 3 && product.stock > 0 && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Últimas {product.stock} unidades disponibles
              </span>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={() => toggle(product)}
            className={`flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold active:scale-[0.98] transition-all border-2 ${
              added
                ? "border-gold text-gold bg-transparent"
                : "border-transparent bg-gold text-white shadow-md hover:brightness-105"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Quitar del carrito
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Agregar al carrito
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
