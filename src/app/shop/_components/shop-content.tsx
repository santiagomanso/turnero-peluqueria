"use client";

import { useState } from "react";
import { ShoppingCart, Star, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

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

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (id: number) => void;
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd(product.id);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white border border-border-subtle rounded-2xl p-3 w-36 shrink-0 flex flex-col gap-2 shadow-sm">
      <div className="bg-surface rounded-xl h-28 flex items-center justify-center relative">
        <span className="text-4xl">{product.emoji}</span>
        <div className="absolute top-1.5 right-1.5 bg-gold-soft border border-gold-border rounded-md px-1.5 py-0.5">
          <span className="text-[0.5rem] text-gold font-bold uppercase tracking-[0.08em]">
            {product.brand}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-xs font-bold text-content mb-0.5">{product.name}</p>
        <p className="text-[0.6rem] text-content-quaternary mb-1">
          {product.desc}
        </p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[0.6rem] text-content-quaternary">
            {product.rating}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-content">
          ${product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        </span>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-[0.6rem] font-bold ${
            added
              ? "bg-gold-soft text-gold border border-gold-border"
              : "bg-gold text-white"
          }`}
        >
          <ShoppingCart className="w-3 h-3" />
          {added ? "✓" : "Agregar"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  products,
  onAdd,
  hideHeader,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  onAdd: (id: number) => void;
  hideHeader?: boolean;
}) {
  return (
    <div className="mb-5">
      {!hideHeader && (
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="text-lg font-extrabold text-content leading-tight">
              {title}
            </h3>
            <p className="text-[0.6rem] text-content-quaternary uppercase tracking-widest mt-0.5">
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
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}

export default function ShopContent() {
  const [cart, setCart] = useState<number[]>([]);
  const addToCart = (id: number) => setCart((prev) => [...prev, id]);

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-between items-center mb-5">
        <Link
          href="/"
          className="p-2 rounded-xl bg-white border border-border-subtle text-content"
        >
          <Home strokeWidth={1.5} className="h-5 w-5" />
        </Link>
        <span className="text-[0.75rem] font-semibold tracking-[0.18em] uppercase text-content">
          Tienda
        </span>
        <div className="relative">
          <div className="p-2 rounded-xl bg-white border border-border-subtle text-content">
            <ShoppingCart strokeWidth={1.5} className="h-5 w-5" />
          </div>
          {cart.length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
              <span className="text-[0.5rem] text-white font-extrabold">
                {cart.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Page header + first section label on same row */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-content leading-tight">
            Shampoos
          </h2>
          <p className="text-[0.6rem] text-gold uppercase tracking-widest mt-0.5">
            Cuidado capilar
          </p>
          <div className="w-7 h-px mt-1.5 bg-gold-gradient" />
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-content leading-tight">
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
        onAdd={addToCart}
        hideHeader
      />
      <Section
        title="Sprays"
        subtitle="Tratamiento y acabado"
        products={sprays}
        onAdd={addToCart}
      />
    </div>
  );
}
