import { HomeNavbar } from "@/app/_components/home-screen/home-navbar";
import CartButton from "./cart-button";

export default function ShopNavbar() {
  return (
    <HomeNavbar
      position="sticky"
      pageTitle="Tienda"
      rightExtra={<CartButton />}
    />
  );
}
