"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, Check, Star } from "lucide-react";
import { SHOP_CATEGORIES, type ShopCategory, type Product } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { useCart } from "@/app/shop/_store/use-cart";

// ─── Category accent colors ────────────────────────────────────────────────────

const CATEGORY_ACCENT: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador":     "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25",
  "Mascarillas y Baños de Crema": "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25",
  "Tratamientos Capilares":       "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
  "Aceites y Serums":             "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  "Protectores y Sprays":         "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/25",
  "Cremas para Peinar":           "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/25",
  "Accesorios":                   "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/25",
};

const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador":     "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares":       "✨",
  "Aceites y Serums":             "🌿",
  "Protectores y Sprays":         "💨",
  "Cremas para Peinar":           "🪄",
  "Accesorios":                   "🪮",
};

// ─── Product card (vertical, works for both featured and regular) ─────────────

function ProductCard({ product, category }: { product: Product; category: ShopCategory }) {
  const added = useCart((state) => state.items.some((i) => i.id === product.id));
  const priceFormatted = `$${product.price.toLocaleString("es-AR")}`;
  const href = `/shop/${categoryToSlug(category)}/${product.id}`;

  return (
    <Link
      href={href}
      className={`relative rounded-2xl overflow-hidden flex flex-col shadow-sm bg-white dark:bg-zinc-900 ring-2 transition-[box-shadow] duration-200 h-full ${
        added ? "ring-gold" : "ring-border-subtle dark:ring-zinc-800"
      }`}
    >
      {/* Badges row */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 flex-wrap">
        {product.featured && (
          <span className="flex items-center gap-1 bg-amber-400/90 text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shadow">
            <Star className="w-2.5 h-2.5 fill-white" />
            Destacado
          </span>
        )}
        {added && (
          <span className="flex items-center gap-1 bg-gold text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shadow">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
            En carrito
          </span>
        )}
      </div>

      {/* Image */}
      <div className="bg-surface dark:bg-zinc-800 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl select-none">
            {CATEGORY_EMOJI[product.category as ShopCategory] ?? "📦"}
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute bottom-2 right-2 text-[0.55rem] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300/50 px-1.5 py-0.5 rounded-full">
            Últimas unidades
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1 justify-between">
        <div>
          <p className="text-xs font-bold text-content dark:text-zinc-100 leading-tight">
            {product.name}
          </p>
          {product.description && (
            <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-500 mt-0.5 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <span className="text-sm font-extrabold text-content dark:text-zinc-100 mt-1">
          {priceFormatted}
        </span>
      </div>
    </Link>
  );
}

// ─── Category switcher ────────────────────────────────────────────────────────

function CategorySwitcher({ active }: { active: ShopCategory }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
      {SHOP_CATEGORIES.map((cat) => {
        const isActive = cat === active;
        const accent = CATEGORY_ACCENT[cat];
        return (
          <Link
            key={cat}
            href={`/shop/${categoryToSlug(cat)}`}
            className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              isActive
                ? accent
                : "border-border-subtle dark:border-zinc-800 text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300"
            }`}
          >
            <span className="text-sm leading-none">{CATEGORY_EMOJI[cat]}</span>
            <span className="hidden xs:inline">{cat.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Fixed header (rendered outside the scrollable area by page.tsx) ──────────

export function CategoryHeader({ category }: { category: ShopCategory }) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[0.65rem] text-content-tertiary dark:text-zinc-500 mb-4">
        <Link href="/shop" className="hover:text-gold transition-colors">
          Tienda
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content dark:text-zinc-300 font-medium">{category}</span>
      </div>

      {/* Category title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl">{CATEGORY_EMOJI[category]}</span>
          <h2 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight">
            {category}
          </h2>
        </div>
        <div className="w-7 h-px mt-1.5 bg-gold-gradient" />
      </div>

      {/* Category switcher */}
      <div className="mb-4">
        <CategorySwitcher active={category} />
      </div>
    </>
  );
}

// ─── Scrollable product bento grid ────────────────────────────────────────────

interface CategoryViewProps {
  category: ShopCategory;
  products: Product[];
}

export default function CategoryView({ category, products }: CategoryViewProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Product count — fixed outside scroll */}
      <p className="shrink-0 text-[0.65rem] text-content-tertiary dark:text-zinc-500 uppercase tracking-widest mb-4">
        {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
      </p>

      {/* Scrollable area — only the product grid */}
      <div className="flex-1 overflow-y-auto pb-8 px-0.5 pt-0.5">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20 gap-3"
          >
            <Package size={40} className="text-content-quaternary dark:text-zinc-600 opacity-40" />
            <p className="text-sm text-content-tertiary dark:text-zinc-500 text-center">
              No hay productos disponibles en esta categoría.
            </p>
            <Link
              href="/shop"
              className="text-xs font-semibold text-gold hover:underline mt-1"
            >
              Ver todas las categorías
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={category}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 28,
                    delay: i * 0.05,
                  }}
                >
                  <ProductCard product={product} category={category} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
