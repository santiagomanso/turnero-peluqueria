import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import CartButton from "./_components/cart-button";
import ShopHeader from "./_components/shop-header";
import ShopCategoriesData from "./_components/shop-categories-data";
import BentoSkeleton from "./_components/bento-skeleton";

export default function ShopPage() {
  return (
    <Container.wrapper className="h-svh">
      <Container.content className="h-svh md:h-[85vh]">
        {/* Fixed: navbar + section header */}
        <Navbar
          title="Tienda Online"
          rightElement={<CartButton />}
        />
        <ShopHeader />

        {/* Scrollable: bento grid only */}
        <div className="flex-1 overflow-y-auto -mx-4 px-4">
          <Suspense fallback={<BentoSkeleton />}>
            <ShopCategoriesData />
          </Suspense>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
