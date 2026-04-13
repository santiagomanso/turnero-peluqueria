"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { cn } from "@/lib/utils";

const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador": "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares": "✨",
  "Aceites y Serums": "🌿",
  "Protectores y Sprays": "💨",
  "Cremas para Peinar": "🪄",
  Accesorios: "🪮",
};

export default function ShopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle dark:border-zinc-800 py-8 px-4 gap-1">
      {/* "All categories" link */}
      <Link
        href="/shop"
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          pathname === "/shop"
            ? "bg-gold/10 text-content dark:text-zinc-100"
            : "text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <ShoppingBag className="w-4 h-4 shrink-0" />
        <span>Todas las categorías</span>
      </Link>

      <div className="my-2 h-px bg-border-subtle dark:bg-zinc-800" />

      {SHOP_CATEGORIES.map((cat) => {
        const slug = categoryToSlug(cat);
        const href = `/shop/${slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-gold/10 text-content dark:text-zinc-100 font-medium"
                : "text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <span className="text-lg leading-none w-5 text-center">
              {CATEGORY_EMOJI[cat]}
            </span>
            <span className="truncate">{cat}</span>
          </Link>
        );
      })}
    </aside>
  );
}
