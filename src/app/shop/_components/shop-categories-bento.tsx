"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";

const MotionLink = motion(Link);
const MotionButton = motion.button;

// ─── Category visual metadata ──────────────────────────────────────────────────

type CategorySize = "xl" | "wide" | "sm";

interface CategoryMeta {
  emoji: string;
  description: string;
  cardBg: string;
  gradient: string;
  glowColor: string;
  accentText: string;
  accentBg: string;
  mockProducts: string[];
  size: CategorySize;
  imageBg?: string;
}

export const CATEGORY_META: Record<ShopCategory, CategoryMeta> = {
  "Shampoo y Acondicionador": {
    emoji: "💧",
    description: "Limpieza y nutrición para cada tipo de cabello",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: [
      "Hydra Shine",
      "Color Protect",
      "Repair Bond",
      "Gold Elixir",
    ],
    size: "xl",
    imageBg: "/shop/shampoo.png",
  },
  "Mascarillas y Baños de Crema": {
    emoji: "🫙",
    description: "Nutrición profunda y reparación intensiva",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: ["Gold Mask", "Honey Repair", "Deep Nourish"],
    size: "sm",
    imageBg: "/shop/cremas.png",
  },
  "Tratamientos Capilares": {
    emoji: "✨",
    description: "Tratamientos profesionales para el hogar",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: ["Bond Builder", "Keratin Pro", "Detox Serum"],
    size: "sm",
    imageBg: "/shop/tratamientoscapilares.png",
  },
  "Aceites y Serums": {
    emoji: "🌿",
    description: "Aceites naturales y serums de alta concentración",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: ["Argan Gold", "Silk Drops", "Camellia Oil"],
    size: "wide",
    imageBg: "/shop/aceitesyserums.png",
  },
  "Protectores y Sprays": {
    emoji: "💨",
    description: "Protección térmica y acabados profesionales",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: ["Heat Shield", "Velvet Mist", "UV Block"],
    size: "wide",
    imageBg: "/shop/spray.png",
  },
  "Cremas para Peinar": {
    emoji: "🪄",
    description: "Control y definición sin residuos",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: ["Curl Definer", "Smooth Control", "Volume Cream"],
    size: "sm",
    imageBg: "/shop/cremasparapeinar.png",
  },
  Accesorios: {
    emoji: "🪮",
    description: "Todo lo que tu rutina necesita",
    cardBg: "bg-zinc-900",
    gradient:
      "from-gray-500/90 to-zinc-400/80 dark:from-neutral-900/90 dark:to-black/80",
    glowColor: "rgba(120, 120, 120, 0.5)",
    accentText: "text-white",
    accentBg: "bg-white/15 border-white/25",
    mockProducts: ["Silk Scrunchie", "Wide Comb", "Heat Cap"],
    size: "sm",
    imageBg: "/shop/accesorios.png",
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
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
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

// ─── Shared helpers ────────────────────────────────────────────────────────────

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

function imageBgStyle(imageBg?: string): React.CSSProperties {
  if (!imageBg) return {};
  return {
    backgroundImage: `url(${imageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
  };
}

// ─── Card components ───────────────────────────────────────────────────────────

function XLCard({
  name,
  meta,
  count,
  onSelect,
}: {
  name: ShopCategory;
  meta: CategoryMeta;
  count: number;
  onSelect?: (cat: string) => void;
}) {
  const displayCount = count > 0 ? count : meta.mockProducts.length + 2;
  const hasImage = !!meta.imageBg;
  const sharedStyle = {
    "--glow": meta.glowColor,
    ...imageBgStyle(meta.imageBg),
  } as React.CSSProperties;
  const sharedClass = `${SIZE_CLASSES.xl} group relative overflow-hidden rounded-2xl border border-border-subtle dark:border-zinc-800 ${!hasImage ? meta.cardBg : ""} cursor-pointer hover:shadow-[0_0_32px_var(--glow)] transition-shadow duration-300`;

  const inner = (
    <>
      <div
        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} ${hasImage ? "opacity-100" : "opacity-60 group-hover:opacity-100"} transition-opacity duration-300`}
      />
      {!hasImage && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full"
          style={{
            background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
      <div className="relative h-full flex flex-col p-5 gap-3 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
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
        <div className="flex-1">
          <h3
            className={`text-xl font-extrabold leading-tight mb-1 ${hasImage ? "text-white" : "text-content dark:text-zinc-100"}`}
          >
            {name}
          </h3>
          <p
            className={`text-xs leading-relaxed hidden lg:block ${hasImage ? "text-white/70" : "text-content-tertiary dark:text-zinc-500"}`}
          >
            {meta.description}
          </p>
        </div>
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
    </>
  );

  if (onSelect) {
    return (
      <MotionButton
        onClick={() => onSelect(name)}
        variants={cardVariants}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={sharedStyle}
        className={sharedClass}
      >
        {inner}
      </MotionButton>
    );
  }
  return (
    <MotionLink
      href={`/shop/${categoryToSlug(name)}`}
      variants={cardVariants}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={sharedStyle}
      className={sharedClass}
    >
      {inner}
    </MotionLink>
  );
}

function WideCard({
  name,
  meta,
  count,
  onSelect,
}: {
  name: ShopCategory;
  meta: CategoryMeta;
  count: number;
  onSelect?: (cat: string) => void;
}) {
  const displayCount = count > 0 ? count : meta.mockProducts.length + 1;
  const hasImage = !!meta.imageBg;
  const sharedStyle = {
    "--glow": meta.glowColor,
    ...imageBgStyle(meta.imageBg),
  } as React.CSSProperties;
  const sharedClass = `${SIZE_CLASSES.wide} group relative overflow-hidden rounded-2xl border border-border-subtle dark:border-zinc-800 ${!hasImage ? meta.cardBg : ""} cursor-pointer hover:shadow-[0_0_24px_var(--glow)] transition-shadow duration-300`;

  const inner = (
    <>
      <div
        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} ${hasImage ? "opacity-100" : "opacity-50 group-hover:opacity-90"} transition-opacity duration-300`}
      />
      <div className="relative h-full flex items-center gap-4 px-5 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
        <span className="text-4xl select-none shrink-0">{meta.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-extrabold leading-tight ${hasImage ? "text-white" : "text-content dark:text-zinc-100"}`}
          >
            {name}
          </h3>
          <p
            className={`text-[0.65rem] mt-0.5 truncate ${hasImage ? "text-white/70" : "text-content-tertiary dark:text-zinc-500"}`}
          >
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
        <div className="shrink-0 text-right">
          <span className={`text-lg font-black ${meta.accentText}`}>
            {displayCount}
          </span>
          <p
            className={`text-[0.6rem] uppercase tracking-wider ${hasImage ? "text-white/50" : "text-content-quaternary dark:text-zinc-600"}`}
          >
            items
          </p>
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <MotionButton
        onClick={() => onSelect(name)}
        variants={cardVariants}
        whileHover={{ scale: 1.012 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={sharedStyle}
        className={sharedClass}
      >
        {inner}
      </MotionButton>
    );
  }
  return (
    <MotionLink
      href={`/shop/${categoryToSlug(name)}`}
      variants={cardVariants}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={sharedStyle}
      className={sharedClass}
    >
      {inner}
    </MotionLink>
  );
}

function SmCard({
  name,
  meta,
  count,
  onSelect,
}: {
  name: ShopCategory;
  meta: CategoryMeta;
  count: number;
  onSelect?: (cat: string) => void;
}) {
  const displayCount = count > 0 ? count : meta.mockProducts.length;
  const hasImage = !!meta.imageBg;
  const sharedStyle = {
    "--glow": meta.glowColor,
    ...imageBgStyle(meta.imageBg),
  } as React.CSSProperties;
  const sharedClass = `${SIZE_CLASSES.sm} group relative overflow-hidden rounded-2xl border border-border-subtle dark:border-zinc-800 ${!hasImage ? meta.cardBg : ""} cursor-pointer hover:shadow-[0_0_20px_var(--glow)] transition-shadow duration-300`;

  const inner = (
    <>
      <div
        className={`absolute inset-0 bg-linear-to-br ${meta.gradient} ${hasImage ? "opacity-100" : "opacity-50 group-hover:opacity-90"} transition-opacity duration-300`}
      />
      <div
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)`,
        }}
      />
      <div className="relative h-full flex flex-col p-4 justify-between [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
        <div>
          <span className="text-3xl select-none block mb-2">{meta.emoji}</span>
          <h3
            className={`text-sm font-extrabold leading-tight ${hasImage ? "text-white" : "text-content dark:text-zinc-100"}`}
          >
            {name}
          </h3>
        </div>
        <span
          className={`text-[0.6rem] font-semibold uppercase tracking-wider ${meta.accentText}`}
        >
          {displayCount} productos
        </span>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <MotionButton
        onClick={() => onSelect(name)}
        variants={cardVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={sharedStyle}
        className={sharedClass}
      >
        {inner}
      </MotionButton>
    );
  }
  return (
    <MotionLink
      href={`/shop/${categoryToSlug(name)}`}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={sharedStyle}
      className={sharedClass}
    >
      {inner}
    </MotionLink>
  );
}

// ─── Main bento grid ───────────────────────────────────────────────────────────

interface ShopCategoriesBentoProps {
  categoryCounts: Record<string, number>;
  /** Si se pasa, las cards se renderizan como botones que llaman onSelect en vez de navegar */
  onSelect?: (cat: string) => void;
}

export default function ShopCategoriesBento({
  categoryCounts,
  onSelect,
}: ShopCategoriesBentoProps) {
  return (
    <div className="pb-8">
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

          if (meta.size === "xl")
            return (
              <XLCard
                key={name}
                name={name}
                meta={meta}
                count={count}
                onSelect={onSelect}
              />
            );
          if (meta.size === "wide")
            return (
              <WideCard
                key={name}
                name={name}
                meta={meta}
                count={count}
                onSelect={onSelect}
              />
            );
          return (
            <SmCard
              key={name}
              name={name}
              meta={meta}
              count={count}
              onSelect={onSelect}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
