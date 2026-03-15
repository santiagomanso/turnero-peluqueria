import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";

/**
 * Converts a category name to a URL-safe slug.
 * e.g. "Shampoo y Acondicionador" → "shampoo-y-acondicionador"
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Finds the ShopCategory that matches a given URL slug.
 * Returns undefined if not found.
 */
export function slugToCategory(slug: string): ShopCategory | undefined {
  return SHOP_CATEGORIES.find((c) => categoryToSlug(c) === slug);
}
