import { getActiveProductsByCategory } from "@/services/shop";
import type { ShopCategory } from "@/types/shop";
import CategoryView from "./category-view";

/**
 * Async server component — fetches products for the given category
 * and renders the client view. Wrapped in Suspense by the parent page.
 */
export default async function CategoryData({ category }: { category: ShopCategory }) {
  const products = await getActiveProductsByCategory(category);
  return <CategoryView category={category} products={products} />;
}
