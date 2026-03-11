import { Container } from "@/components/ui/container";
import ShopContent from "./_components/shop-content";
import Navbar from "@/components/navbar";
import CartButton from "./_components/cart-button";

export default function ShopPage() {
  return (
    <Container.wrapper>
      <Container.content>
        <Navbar
          title="Tienda Online"
          hideSettings
          rightElement={<CartButton />}
        />
        <ShopContent />
      </Container.content>
    </Container.wrapper>
  );
}
