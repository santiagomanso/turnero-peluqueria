import { Suspense } from "react";
import ShopNavbar from "./_components/shop-navbar";
import ShopSidebar from "./_components/shop-sidebar";
import ShopHeader from "./_components/shop-header";
import ShopCategoriesData from "./_components/shop-categories-data";
import BentoSkeleton from "./_components/bento-skeleton";

export default function ShopPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <ShopNavbar />

      <div className="flex flex-1 min-h-0">
        <ShopSidebar />

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-y-auto px-5 py-6 lg:px-12 lg:py-10">
          <ShopHeader />
          <Suspense fallback={<BentoSkeleton />}>
            <ShopCategoriesData />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
