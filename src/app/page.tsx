import Header from "@/components/header";
import HomeLink from "@/components/home-link";
import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { Plus, SquarePen, ShoppingCart, Phone, Settings2 } from "lucide-react";

export default function Home() {
  return (
    <Container.wrapper>
      <Container.content>
        <Navbar title="Inicio" />
        <div className="space-y-5">
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

          {/* Admin — separado visualmente */}
          <div className="pt-2 border-t border-border-subtle">
            <HomeLink
              path="/admin"
              label="Administración"
              icon={Settings2}
              type="subtle"
            />
          </div>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
