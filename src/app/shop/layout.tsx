import CartDrawerClient from "./_components/cart-drawer-client";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CartDrawerClient />
    </>
  );
}
