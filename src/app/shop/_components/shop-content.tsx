"use client";

import { ShoppingCart, Star, ChevronRight, Check } from "lucide-react";

import { useCart } from "../_store/use-cart";
import type { Product as ShopProduct } from "@/types/shop";

const shampoos = [
  {
    id: 1,
    name: "Hydra Shine",
    brand: "Kérastase",
    price: 4200,
    rating: 4.8,
    desc: "Cabello seco y opaco",
    emoji: "💧",
  },
  {
    id: 2,
    name: "Color Protect",
    brand: "L'Oréal Pro",
    price: 3100,
    rating: 4.6,
    desc: "Cabello teñido",
    emoji: "🌸",
  },
  {
    id: 3,
    name: "Repair Bond",
    brand: "Redken",
    price: 3800,
    rating: 4.9,
    desc: "Cabello dañado",
    emoji: "✨",
  },
  {
    id: 4,
    name: "Gold Elixir",
    brand: "Moroccanoil",
    price: 5200,
    rating: 5.0,
    desc: "Nutrición profunda",
    emoji: "🌿",
  },
];

const sprays = [
  {
    id: 5,
    name: "Velvet Mist",
    brand: "Schwarzkopf",
    price: 2400,
    rating: 4.7,
    desc: "Brillo intenso",
    emoji: "🌬️",
  },
  {
    id: 6,
    name: "Heat Shield",
    brand: "Tresemmé",
    price: 1800,
    rating: 4.5,
    desc: "Protección térmica",
    emoji: "🔥",
  },
  {
    id: 7,
    name: "Volume Boost",
    brand: "Wella",
    price: 2900,
    rating: 4.6,
    desc: "Volumen y cuerpo",
    emoji: "💨",
  },
  {
    id: 8,
    name: "Silk Finish",
    brand: "Kérastase",
    price: 4600,
    rating: 4.9,
    desc: "Acabado sedoso",
    emoji: "🪄",
  },
];

type Product = (typeof shampoos)[0];

function ProductCard({ product }: { product: Product }) {
  const added = useCart((state) =>
    state.items.some((i) => i.id === String(product.id)),
  );
  const toggle = useCart((state) => state.toggle);

  // Adapt mock product to the shape toggle expects
  const asShopProduct: ShopProduct = {
    id: String(product.id),
    name: product.name,
    price: product.price,
    description: product.desc,
    imageUrl: null,
    category: "Shampoo y Acondicionador",
    stock: 10,
    active: true,
    featured: false,
    createdAt: new Date(),
  };

  return (
    <div
      className={`border-2 rounded-2xl p-3 w-36 shrink-0 flex flex-col gap-2 shadow-sm transition-all duration-200 ${
        added
          ? "ring-2 ring-gold border-transparent bg-white dark:bg-zinc-900"
          : "border-transparent border border-border-subtle dark:border-zinc-800 bg-white dark:bg-zinc-900"
      }`}
    >
      <div className="bg-surface dark:bg-zinc-800 rounded-xl h-28 flex items-center justify-center relative">
        <span className="text-4xl">{product.emoji}</span>
        <div className="absolute top-1.5 right-1.5 bg-gold-soft dark:bg-zinc-700 border border-gold-border dark:border-zinc-600 rounded-md px-1.5 py-0.5">
          <span className="text-[0.5rem] text-gold font-bold uppercase tracking-[0.08em]">
            {product.brand}
          </span>
        </div>
        {added && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-gold text-white text-[0.5rem] font-bold px-1.5 py-0.5 rounded-full">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs font-bold text-content dark:text-zinc-100 mb-0.5">
          {product.name}
        </p>
        <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-500 mb-1">
          {product.desc}
        </p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[0.6rem] text-content-quaternary dark:text-zinc-500">
            {product.rating}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-content dark:text-zinc-100">
          ${product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        </span>
        <button
          onClick={() => toggle(asShopProduct)}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-[0.6rem] font-bold ${
            added
              ? "border border-gold text-gold bg-transparent"
              : "bg-gold text-white"
          }`}
        >
          {added ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
          {added ? "Quitar" : "Agregar"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  products,
  hideHeader,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  hideHeader?: boolean;
}) {
  return (
    <div className="mb-5">
      {!hideHeader && (
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="text-lg font-extrabold text-content dark:text-zinc-100 leading-tight">
              {title}
            </h3>
            <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-500 uppercase tracking-widest mt-0.5">
              {subtitle}
            </p>
            <div className="w-7 h-px mt-1.5 bg-gold-gradient" />
          </div>
          <button className="flex items-center gap-1 text-[0.65rem] text-gold font-semibold">
            Ver todo <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function ShopContent() {
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight">
            Shampoos
          </h2>
          <p className="text-[0.6rem] text-gold uppercase tracking-widest mt-0.5">
            Cuidado capilar
          </p>
          <div className="w-7 h-px mt-1.5 bg-gold-gradient" />
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight">
            Insumos
          </h2>
          <p className="text-[0.6rem] text-gold uppercase tracking-widest mt-0.5">
            Productos profesionales
          </p>
          <div className="w-7 h-px mt-1.5 bg-gold-gradient ml-auto" />
        </div>
      </div>

      <Section
        title="Shampoos"
        subtitle="Cuidado capilar"
        products={shampoos}
        hideHeader
      />
      <Section
        title="Sprays"
        subtitle="Tratamiento y acabado"
        products={sprays}
      />
    </div>
  );
}
