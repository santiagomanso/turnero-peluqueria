import { Suspense } from "react";
import ShopNavbar from "@/app/shop/_components/shop-navbar";
import ShopSidebar from "@/app/shop/_components/shop-sidebar";
import ShopCategoryPills from "@/app/shop/_components/shop-category-pills";
import ProductData from "./_components/product-data";
import ProductSkeleton from "./_components/product-skeleton";

interface Props {
  params: Promise<{ category: string; productId: string }>;
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <ShopNavbar />

      <div className="flex flex-1 min-h-0">
        <ShopSidebar />

        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Mobile/tablet pills */}
          <div className="pt-5">
            <ShopCategoryPills />
          </div>

          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto px-5 pb-10 lg:px-12 lg:py-10">
            <Suspense fallback={<ProductSkeleton />}>
              <ProductData params={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
