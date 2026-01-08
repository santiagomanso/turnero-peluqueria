import Header from '@/components/header';
import HomeLink from '@/components/home-link';
import Navbar from '@/components/navbar';
import { Plus, SquarePen, Trash2, ShoppingCart, Phone } from 'lucide-react';

export default function Home() {
  return (
    <main className='bg-linear-to-br from-fuchsia-950 to-purple-900  h-svh w-screen flex items-center justify-center font-archivo'>
      <section className='bg-linear-to-br from-pink-500 to-fuchsia-950 max-w-4xl flex flex-col justify-center pt-4 pb-8 px-4 sm:w-5/6 lg:w-sm rounded-lg'>
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
            />
          </ul>
        </div>
      </section>
    </main>
  );
}
