import Header from "@/components/header";
import HomeLink from "@/components/home-link";
import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { Plus, SquarePen, Trash2, ShoppingCart, Phone } from "lucide-react";

export default function Home() {
  return (
    <Container.wrapper>
      <Container.content>
        <Navbar />
        <div className='space-y-5'>
          <Header />

          <ul className='space-y-4'>
            <HomeLink
              path='/appointments'
              label='Solicitar turno y señar'
              icon={Plus}
            />
            <HomeLink path='/modify' label='Modificar turno' icon={SquarePen} />
            <HomeLink path='/cancel' label='Cancelar turno' icon={Trash2} />
            <HomeLink
              path='/shop'
              label='Tienda online insumos'
              icon={ShoppingCart}
            />
            <HomeLink
              path='/whatsapp'
              label='WhatsApp consultas'
              icon={Phone}
              type='external-link'
            />
          </ul>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
