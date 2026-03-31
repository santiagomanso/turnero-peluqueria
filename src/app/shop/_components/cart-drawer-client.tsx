"use client";

import dynamic from "next/dynamic";

// CartDrawer depends on client-only Zustand state — SSR disabled to prevent hydration mismatch
const CartDrawer = dynamic(() => import("./cart-drawer"), { ssr: false });

export default function CartDrawerClient() {
  return <CartDrawer />;
}
