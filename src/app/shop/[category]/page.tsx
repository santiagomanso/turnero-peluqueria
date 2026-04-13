import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopNavbar from "@/app/shop/_components/shop-navbar";
import ShopSidebar from "@/app/shop/_components/shop-sidebar";
import ShopCategoryPills from "@/app/shop/_components/shop-category-pills";
import CategoryData from "./_components/category-data";
import CategorySkeleton from "./_components/category-skeleton";
import { CategoryHeader } from "./_components/category-view";
import { slugToCategory } from "@/lib/shop-utils";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <ShopNavbar />

      <div className="flex flex-1 min-h-0">
        <ShopSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile/tablet pills */}
          <div className="pt-5">
            <ShopCategoryPills />
          </div>

          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto px-5 pb-8 lg:px-12 lg:py-10">
            <CategoryHeader category={category} />
            <Suspense fallback={<CategorySkeleton />}>
              <CategoryData category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
