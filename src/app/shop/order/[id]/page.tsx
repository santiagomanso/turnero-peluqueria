import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import { getOrderById } from "@/services/orders";
import OrderView from "./_components/order-view";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <Container.wrapper>
      <Container.content>
        <Navbar title="Tu pedido" hideSettings />
        <div className="flex-1 overflow-y-auto -mx-4 px-4 pt-2">
          <OrderView order={order} />
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
