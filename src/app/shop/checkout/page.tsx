import ShopNavbar from "@/app/shop/_components/shop-navbar";
import ShopSidebar from "@/app/shop/_components/shop-sidebar";
import CheckoutForm from "./_components/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <ShopNavbar />

      <div className="flex flex-1 min-h-0">
        <ShopSidebar />

        <div className="flex-1 min-w-0 overflow-y-auto px-5 py-8 lg:px-12 lg:py-10">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  );
}
