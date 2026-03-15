"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";

const MotionLink = motion(Link);

// ─── Category visual metadata ──────────────────────────────────────────────────

type CategorySize = "xl" | "wide" | "sm";

interface CategoryMeta {
  emoji: string;
  description: string;
  cardBg: string; // base background of the card (light + dark)
  gradient: string; // gradient overlay on top of cardBg
  glowColor: string; // rgba for box-shadow glow on hover
  accentText: string; // tailwind text color class for accent elements
  accentBg: string; // tailwind bg class for chip background
  mockProducts: string[];
  size: CategorySize;
}

const CATEGORY_META: Record<ShopCategory, CategoryMeta> = {
  "Shampoo y Acondicionador": {
    emoji: "💧",
    description: "Limpieza y nutrición para cada tipo de cabello",
    cardBg: "bg-violet-100 dark:bg-violet-950",
    gradient: "from-violet-400/40 via-purple-300/20 to-transparent",
    glowColor: "rgba(139, 92, 246, 0.45)",
    accentText: "text-violet-700 dark:text-violet-300",
    accentBg: "bg-violet-500/15 border-violet-500/30",
    mockProducts: [
      "Hydra Shine",
      "Color Protect",
      "Repair Bond",
      "Gold Elixir",
    ],
    size: "xl",
  },
  "Mascarillas y Baños de Crema": {
    emoji: "🫙",
    description: "Nutrición profunda y reparación intensiva",
    cardBg: "bg-rose-100 dark:bg-rose-950",
    gradient: "from-rose-400/40 via-pink-300/20 to-transparent",
    glowColor: "rgba(244, 63, 94, 0.45)",
    accentText: "text-rose-700 dark:text-rose-300",
    accentBg: "bg-rose-500/15 border-rose-500/30",
    mockProducts: ["Gold Mask", "Honey Repair", "Deep Nourish"],
    size: "sm",
  },
  "Tratamientos Capilares": {
    emoji: "✨",
    description: "Tratamientos profesionales para el hogar",
    cardBg: "bg-amber-100 dark:bg-amber-950",
    gradient: "from-amber-400/40 via-yellow-300/20 to-transparent",
    glowColor: "rgba(245, 158, 11, 0.45)",
    accentText: "text-amber-700 dark:text-amber-300",
    accentBg: "bg-amber-500/15 border-amber-500/30",
    mockProducts: ["Bond Builder", "Keratin Pro", "Detox Serum"],
    size: "sm",
  },
  "Aceites y Serums": {
    emoji: "🌿",
    description: "Aceites naturales y serums de alta concentración",
    cardBg: "bg-emerald-100 dark:bg-emerald-950",
    gradient: "from-emerald-400/40 via-green-300/20 to-transparent",
    glowColor: "rgba(16, 185, 129, 0.45)",
    accentText: "text-emerald-700 dark:text-emerald-300",
    accentBg: "bg-emerald-500/15 border-emerald-500/30",
    mockProducts: ["Argan Gold", "Silk Drops", "Camellia Oil"],
    size: "wide",
  },
  "Protectores y Sprays": {
    emoji: "💨",
    description: "Protección térmica y acabados profesionales",
    cardBg: "bg-sky-100 dark:bg-sky-950",
    gradient: "from-sky-400/40 via-blue-300/20 to-transparent",
    glowColor: "rgba(14, 165, 233, 0.45)",
    accentText: "text-sky-700 dark:text-sky-300",
    accentBg: "bg-sky-500/15 border-sky-500/30",
    mockProducts: ["Heat Shield", "Velvet Mist", "UV Block"],
    size: "wide",
  },
  "Cremas para Peinar": {
    emoji: "🪄",
    description: "Control y definición sin residuos",
    cardBg: "bg-teal-100 dark:bg-teal-950",
    gradient: "from-teal-400/40 via-cyan-300/20 to-transparent",
    glowColor: "rgba(20, 184, 166, 0.45)",
    accentText: "text-teal-700 dark:text-teal-300",
    accentBg: "bg-teal-500/15 border-teal-500/30",
    mockProducts: ["Curl Definer", "Smooth Control", "Volume Cream"],
    size: "sm",
  },
  Accesorios: {
    emoji: "🪮",
    description: "Todo lo que tu rutina necesita",
    cardBg: "bg-orange-100 dark:bg-orange-950",
    gradient: "from-orange-400/40 via-amber-300/20 to-transparent",
    glowColor: "rgba(249, 115, 22, 0.45)",
    accentText: "text-orange-700 dark:text-orange-300",
    accentBg: "bg-orange-500/15 border-orange-500/30",
    mockProducts: ["Silk Scrunchie", "Wide Comb", "Heat Cap"],
    size: "sm",
  },
};

// ─── Grid size classes ─────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<CategorySize, string> = {
  xl: "col-span-2 row-span-1 lg:col-span-2 lg:row-span-2",
  wide: "col-span-2 row-span-1",
  sm: "col-span-1 row-span-1",
};

// ─── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 },
  },
};

// ─── Card components ───────────────────────────────────────────────────────────

function ProductChip({
  name,
  accentBg,
  accentText,
}: {
  name: string;
  accentBg: string;
  accentText: string;
}) {
  return (
    <span
      className={`text-[0.6rem] font-medium px-2 py-0.5 rounded-full border ${accentBg} ${accentText} whitespace-nowrap`}
    >
      {name}
    </span>
  );
}

function XLCard({
  name,
  meta,
  count,
}: {
  name: ShopCategory;
  meta: CategoryMeta;
  count: number;
}) {
  const displayCount = count > 0 ? count : meta.mockProducts.length + 2;

  return (
    <MotionLink
      href={`/shop/${categoryToSlug(name)}`}
      variants={cardVariants}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ "--glow": meta.glowColor } as React.CSSProperties}
      className={`${SIZE_CLASSES.xl} group relative overflow-hidden rounded-2xl border border-border-subtle dark:border-zinc-800 ${meta.cardBg} cursor-pointer hover:shadow-[0_0_32px_var(--glow)] transition-shadow duration-300`}
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Animated background circle */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-linear-to-br opacity-30"
        style={{
          background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative h-full flex flex-col p-5 gap-3">
        {/* Top row: emoji + count */}
        <div className="flex items-start justify-between">
          <motion.span
            className="text-5xl lg:text-6xl select-none"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {meta.emoji}
          </motion.span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${meta.accentBg} ${meta.accentText}`}
          >
            {displayCount} productos
          </span>
        </div>

        {/* Name + description */}
        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight mb-1">
            {name}
          </h3>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 leading-relaxed hidden lg:block">
            {meta.description}
          </p>
        </div>

        {/* Product chips */}
        <div className="hidden lg:flex flex-wrap gap-1.5">
          {meta.mockProducts.slice(0, 3).map((p) => (
            <ProductChip
              key={p}
              name={p}
              accentBg={meta.accentBg}
              accentText={meta.accentText}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${meta.accentText}`}
        >
          Ver productos
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.span>
        </div>
      </div>
    </MotionLink>
  );
}

function WideCard({
  name,
  meta,
  count,
}: {
  name: ShopCategory;
  meta: CategoryMeta;
  count: number;
}) {
  const displayCount = count > 0 ? count : meta.mockProducts.length + 1;

  return (
    <MotionLink
      href={`/shop/${categoryToSlug(name)}`}
      variants={cardVariants}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ "--glow": meta.glowColor } as React.CSSProperties}
      className={`${SIZE_CLASSES.wide} group relative overflow-hidden rounded-2xl border border-border-subtle dark:border-zinc-800 ${meta.cardBg} cursor-pointer hover:shadow-[0_0_24px_var(--glow)] transition-shadow duration-300`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} opacity-50 group-hover:opacity-90 transition-opacity duration-300`}
      />

      <div className="relative h-full flex items-center gap-4 px-5">
        <span className="text-4xl select-none shrink-0">{meta.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-content dark:text-zinc-100 leading-tight">
            {name}
          </h3>
          <p className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 mt-0.5 truncate">
            {meta.description}
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {meta.mockProducts.slice(0, 2).map((p) => (
              <ProductChip
                key={p}
                name={p}
                accentBg={meta.accentBg}
                accentText={meta.accentText}
              />
            ))}
          </div>
        </div>
        <div className={"shrink-0 text-right"}>
          <span className={`text-lg font-black ${meta.accentText}`}>
            {displayCount}
          </span>
          <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-600 uppercase tracking-wider">
            items
          </p>
        </div>
      </div>
    </MotionLink>
  );
}

function SmCard({
  name,
  meta,
  count,
}: {
  name: ShopCategory;
  meta: CategoryMeta;
  count: number;
}) {
  const displayCount = count > 0 ? count : meta.mockProducts.length;

  return (
    <MotionLink
      href={`/shop/${categoryToSlug(name)}`}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ "--glow": meta.glowColor } as React.CSSProperties}
      className={`${SIZE_CLASSES.sm} group relative overflow-hidden rounded-2xl border border-border-subtle dark:border-zinc-800 ${meta.cardBg} cursor-pointer hover:shadow-[0_0_20px_var(--glow)] transition-shadow duration-300`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} opacity-50 group-hover:opacity-90 transition-opacity duration-300`}
      />

      {/* Decorative circle */}
      <div
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative h-full flex flex-col p-4 justify-between">
        <div>
          <span className="text-3xl select-none block mb-2">{meta.emoji}</span>
          <h3 className="text-sm font-extrabold text-content dark:text-zinc-100 leading-tight">
            {name}
          </h3>
        </div>
        <span
          className={`text-[0.6rem] font-semibold uppercase tracking-wider ${meta.accentText}`}
        >
          {displayCount} productos
        </span>
      </div>
    </MotionLink>
  );
}

// ─── Main bento grid ───────────────────────────────────────────────────────────

interface ShopCategoriesBentoProps {
  categoryCounts: Record<string, number>;
}

export default function ShopCategoriesBento({
  categoryCounts,
}: ShopCategoriesBentoProps) {
  return (
    <div className="pb-8">
      {/* Bento grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ gridAutoRows: "160px" }}
      >
        {SHOP_CATEGORIES.map((name) => {
          const meta = CATEGORY_META[name];
          const count = categoryCounts[name] ?? 0;

          if (meta.size === "xl") {
            return <XLCard key={name} name={name} meta={meta} count={count} />;
          }
          if (meta.size === "wide") {
            return (
              <WideCard key={name} name={name} meta={meta} count={count} />
            );
          }
          return <SmCard key={name} name={name} meta={meta} count={count} />;
        })}
      </motion.div>
    </div>
  );
}
