import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import CartButton from "@/app/shop/_components/cart-button";
import ProductData from "./_components/product-data";
import ProductSkeleton from "./_components/product-skeleton";

interface Props {
  params: Promise<{ category: string; productId: string }>;
}

export default function ProductPage({ params }: Props) {
  return (
    <Container.wrapper className="h-svh">
      <Container.content className="h-svh md:h-[85vh]">
        <Navbar title="Producto" hideSettings rightElement={<CartButton />} />
        <div className="flex-1 overflow-y-auto -mx-4 px-4 pt-2">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductData params={params} />
          </Suspense>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
