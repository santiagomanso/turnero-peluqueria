import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import CartButton from "@/app/shop/_components/cart-button";
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
    <Container.wrapper className="h-svh">
      <Container.content className="h-svh md:h-[85vh]">
        {/* Fixed: navbar + category header + switcher */}
        <Navbar
          title="Tienda Online"
          hideSettings
          rightElement={<CartButton />}
        />
        <CategoryHeader category={category} />

        {/* CategoryView handles its own internal scroll */}
        <div className="flex-1 min-h-0 flex flex-col -mx-4 px-4">
          <Suspense fallback={<CategorySkeleton />}>
            <CategoryData category={category} />
          </Suspense>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
