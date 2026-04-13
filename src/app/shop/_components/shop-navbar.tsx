"use client";

import PublicNavbar from "@/components/public-navbar";
import CartButton from "./cart-button";

export default function ShopNavbar() {
  return <PublicNavbar rightExtra={<CartButton />} />;
}
