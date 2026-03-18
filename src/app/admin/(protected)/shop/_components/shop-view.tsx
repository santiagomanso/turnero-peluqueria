"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ShoppingCart, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrderesTab } from "./orders-tabs";
import { ProductosTab } from "./products-tab";
import { SHOP_CREATE_EVENT } from "@/app/admin/_components/shop-mobile-controls";
import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import dynamic from "next/dynamic";

const ShopMobileDropdown = dynamic(
  () =>
    import("@/app/admin/_components/shop-mobile-controls").then((m) => ({
      default: m.ShopMobileControls,
    })),
  { ssr: false },
);

type Tab = "ordenes" | "productos";

export function ShopView() {
  const [activeTab, setActiveTab] = useState<Tab>("ordenes");
  const openCreateRef = useRef<(() => void) | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "ordenes",
      label: "Órdenes de compra",
      icon: <ShoppingCart size={15} />,
    },
    {
      id: "productos",
      label: "Gestor de productos",
      icon: <Package size={15} />,
    },
  ];

  const handleOpenCreate = useCallback(() => {
    setActiveTab("productos");
    setTimeout(() => openCreateRef.current?.(), 0);
  }, []);

  useEffect(() => {
    window.addEventListener(SHOP_CREATE_EVENT, handleOpenCreate);
    return () =>
      window.removeEventListener(SHOP_CREATE_EVENT, handleOpenCreate);
  }, [handleOpenCreate]);

  return (
    <div className="flex flex-col h-full max-md:pt-0">
      <AdminPageHeader
        title="Tienda online (admin)"
        subtitle="Administrá tus productos y las órdenes de tus clientes."
        mobileControls={<ShopMobileDropdown />}
        desktopControls={<ShopMobileDropdown />}
      />

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-7 py-5 max-md:px-4 max-md:py-4 gap-5">
        {/* Tabs — never scrolls */}
        <div className="shrink-0 flex items-center gap-1 p-1 rounded-xl bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 gap-1.5 text-xs sm:text-sm",
                activeTab === tab.id
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-content dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700"
                  : "text-content-secondary dark:text-zinc-400",
              )}
            >
              <span
                className={cn(
                  "shrink-0",
                  activeTab === tab.id
                    ? "text-gold"
                    : "text-content-tertiary dark:text-zinc-500",
                )}
              >
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Tab content — flex-1, each tab handles its own scroll */}
        <div className="flex-1 min-h-0">
          {activeTab === "ordenes" ? (
            <div className="overflow-y-auto h-full">
              <OrderesTab />
            </div>
          ) : (
            <ProductosTab
              registerOpenCreate={(fn) => {
                openCreateRef.current = fn;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
