"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../_store/use-cart";

export default function CartButton() {
  const { cart } = useCart();

  return (
    <div className="relative">
      <Button variant="outline" size="icon">
        <ShoppingCart strokeWidth={1.5} className="h-5 w-5" />
      </Button>
      {cart.length > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center pointer-events-none">
          <span className="text-[0.5rem] text-white font-extrabold">
            {cart.length}
          </span>
        </div>
      )}
    </div>
  );
}
