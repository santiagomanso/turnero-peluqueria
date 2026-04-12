"use client";

import PublicNavbar from "@/components/public-navbar";
import CartButton from "./cart-button";

// PublicNavbar is already dynamic(ssr:false) internally.
// We create a thin wrapper that adds CartButton into the right slot.
// PublicNavbar doesn't accept a rightElement prop, so we overlay CartButton
// as a positioned sibling inside a relative wrapper.

export default function ShopNavbar() {
  return (
    <div className="relative shrink-0">
      <PublicNavbar />
      {/* Cart button pinned to the right of the navbar row */}
      <div className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-10">
        <CartButton />
      </div>
    </div>
  );
}
