"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENT: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador":
    "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25",
  "Mascarillas y Baños de Crema":
    "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25",
  "Tratamientos Capilares":
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
  "Aceites y Serums":
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  "Protectores y Sprays":
    "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/25",
  "Cremas para Peinar":
    "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/25",
  Accesorios:
    "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/25",
};

const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador": "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares": "✨",
  "Aceites y Serums": "🌿",
  "Protectores y Sprays": "💨",
  "Cremas para Peinar": "🪄",
  Accesorios: "🪮",
};

export default function ShopCategoryPills() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden overflow-x-auto flex gap-2 pb-1 scrollbar-none px-5 mb-4">
      {SHOP_CATEGORIES.map((cat) => {
        const slug = categoryToSlug(cat);
        const href = `/shop/${slug}`;
        const isActive = pathname === href;
        const accent = CATEGORY_ACCENT[cat];

        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
              isActive
                ? accent
                : "border-border-subtle dark:border-zinc-800 text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300",
            )}
          >
            <span className="text-sm leading-none">{CATEGORY_EMOJI[cat]}</span>
            <span>{cat.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}
