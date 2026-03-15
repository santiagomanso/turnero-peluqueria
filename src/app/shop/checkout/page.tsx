import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import CheckoutForm from "./_components/checkout-form";

export default function CheckoutPage() {
  return (
    <Container.wrapper className="h-svh">
      <Container.content className="h-svh md:h-[85vh]">
        <Navbar title="Checkout" />
        <div className="flex-1 overflow-y-auto -mx-4 px-4">
          <CheckoutForm />
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
