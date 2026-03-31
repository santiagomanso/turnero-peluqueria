import { getCategoryCountsAction } from "../_actions/get-category-counts";
import ShopCategoriesBento from "./shop-categories-bento";

/**
 * Async server component — fetches category counts and renders the bento grid.
 * Wrapped in Suspense by the parent page so the page itself stays non-async.
 */
export default async function ShopCategoriesData() {
  const categoryCounts = await getCategoryCountsAction();
  return <ShopCategoriesBento categoryCounts={categoryCounts} />;
}
