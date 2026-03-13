"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ShoppingCart, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrderesTab } from "./orders-tabs";
import { ProductosTab } from "./products-tab";
import { SHOP_CREATE_EVENT } from "@/app/admin/_components/shop-mobile-controls";

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
    return () => window.removeEventListener(SHOP_CREATE_EVENT, handleOpenCreate);
  }, [handleOpenCreate]);

  return (
    <div className="flex flex-col h-full max-md:pt-0">
      {/* Header desktop */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
        <div>
          <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
            Tienda online
          </h1>
          <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
            Administrá tus productos y las órdenes de tus clientes.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-7 py-5 max-md:px-4 max-md:py-4 flex flex-col gap-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700">
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

          {/* Tab content */}
          {activeTab === "ordenes" ? (
            <OrderesTab />
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
