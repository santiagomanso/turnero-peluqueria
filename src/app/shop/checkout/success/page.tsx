import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import SuccessContent from "./_components/success-content";

export default function CheckoutSuccessPage() {
  return (
    <Container.wrapper>
      <Container.content>
        <Navbar title="Pedido confirmado" hideSettings />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </Container.content>
    </Container.wrapper>
  );
}
