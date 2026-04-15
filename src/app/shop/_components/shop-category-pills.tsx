"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { cn } from "@/lib/utils";

export default function ShopCategoryPills() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden overflow-x-auto flex gap-1 pb-1 scrollbar-none px-5 mb-4">
      {SHOP_CATEGORIES.map((cat: ShopCategory) => {
        const slug = categoryToSlug(cat);
        const href = `/shop/${slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "relative shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-colors",
              isActive
                ? "text-gold font-semibold"
                : "text-content-secondary dark:text-zinc-400 hover:text-content dark:hover:text-zinc-100",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-shop-pill"
                className="absolute inset-0 rounded-lg bg-gold/30 dark:bg-gold/15 border border-gold/40 dark:border-gold/20"
                transition={{ type: "spring" as const, stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}
