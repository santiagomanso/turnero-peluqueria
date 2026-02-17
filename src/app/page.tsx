import Header from "@/components/header";
import HomeLink from "@/components/home-link";
import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { Plus, SquarePen, ShoppingCart, Phone } from "lucide-react";

export default function Home() {
  return (
    <Container.wrapper>
      <Container.content>
        <Navbar title="Inicio" />
        <div className="space-y-5 mt-3">
          <Header />

          <ul className="space-y-4">
            <HomeLink
              path="/appointments/new"
              label="Agendar turno"
              icon={Plus}
            />
            <HomeLink
              path="/appointments/get"
              label="Consultar mi turno"
              icon={SquarePen}
            />
            <HomeLink
              path="/shop"
              label="Tienda online insumos"
              icon={ShoppingCart}
            />
            <HomeLink
              path="/whatsapp"
              label="WhatsApp consultas"
              icon={Phone}
              type="external-link"
            />
          </ul>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
