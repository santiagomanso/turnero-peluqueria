"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  Star,
  AlertTriangle,
  ArrowLeft,
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="space-y-5 pb-8"
    >
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-tertiary dark:text-zinc-500 hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a {product.category}
      </Link>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden bg-surface dark:bg-zinc-800 aspect-4/3 flex items-center justify-center">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-8xl select-none">
            {CATEGORY_EMOJI[product.category as ShopCategory] ?? "📦"}
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            <Star className="w-3 h-3 fill-white" />
            Destacado
          </span>
        )}
      </div>

      {/* Name + price */}
      <div>
        <h1 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight">
          {product.name}
        </h1>
        <p className="text-2xl font-extrabold text-gold mt-1 tabular-nums">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>

      {/* Stock warning */}
      {product.stock <= 3 && product.stock > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Últimas {product.stock} unidades disponibles
          </span>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-content-quaternary dark:text-zinc-500 mb-2">
            Descripción
          </p>
          <p className="text-sm text-content-secondary dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Add to cart button */}
      <button
        onClick={() => toggle(product)}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-all border-2 ${
          added
            ? "border-gold text-gold bg-transparent"
            : "border-transparent bg-gold text-white shadow-md"
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
  );
}
