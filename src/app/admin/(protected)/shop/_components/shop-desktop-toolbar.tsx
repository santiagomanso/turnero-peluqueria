"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ShopMobileControls } from "@/app/admin/_components/shop-mobile-controls";
import {
  SHOP_ACTIVE_CATEGORY_EVENT,
  SHOP_SELECT_CATEGORY_EVENT,
  SHOP_CREATE_EVENT,
  SHOP_ORDERS_SEARCH_EVENT,
  SHOP_ORDERS_STATUS_EVENT,
  SHOP_PRODUCTS_SEARCH_EVENT,
  type StatusFilter,
} from "@/app/admin/_components/shop-mobile-controls";
import { ORDER_STATUS_CONFIG, SHOP_CATEGORIES, type OrderStatus } from "@/types/shop";

type Tab = "ordenes" | "productos";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const ORDER_STATUS_OPTIONS: { value: OrderStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos los estados" },
  ...Object.entries(ORDER_STATUS_CONFIG).map(([k, v]) => ({
    value: k as OrderStatus,
    label: v.label,
  })),
];

const CATEGORY_OPTIONS = [
  { value: "todas", label: "Todas las categorías" },
  ...SHOP_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function ShopDesktopToolbar({ activeTab, onTabChange }: Props) {
  // Orders state
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatus, setOrdersStatus] = useState<OrderStatus | "todos">("todos");

  // Products state
  const [productsSearch, setProductsSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Sync category from products tab
  useEffect(() => {
    function handle(e: Event) {
      const detail = (e as CustomEvent<{ category: string | null; gestorActive: boolean; statusFilter: StatusFilter }>).detail;
      setActiveCategory(detail.category);
    }
    window.addEventListener(SHOP_ACTIVE_CATEGORY_EVENT, handle);
    return () => window.removeEventListener(SHOP_ACTIVE_CATEGORY_EVENT, handle);
  }, []);

  // Dispatch on orders search change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SHOP_ORDERS_SEARCH_EVENT, { detail: { search: ordersSearch } }));
  }, [ordersSearch]);

  // Dispatch on orders status change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SHOP_ORDERS_STATUS_EVENT, { detail: { status: ordersStatus } }));
  }, [ordersStatus]);

  // Dispatch on products search change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SHOP_PRODUCTS_SEARCH_EVENT, { detail: { search: productsSearch } }));
  }, [productsSearch]);

  function handleCategoryChange(cat: string) {
    window.dispatchEvent(new CustomEvent(SHOP_SELECT_CATEGORY_EVENT, { detail: { category: cat } }));
  }

  const categoryLabelShort =
    activeCategory === null || activeCategory === "todas"
      ? "Categorías"
      : activeCategory;

  const categoryLabelFull =
    activeCategory === null || activeCategory === "todas"
      ? "Todas las categorías"
      : activeCategory;

  const statusLabel =
    ordersStatus === "todos"
      ? "Todos los estados"
      : ORDER_STATUS_CONFIG[ordersStatus as OrderStatus]?.label ?? "Estado";

  const TABS = [
    {
      id: "ordenes" as Tab,
      labelShort: "Órdenes",
      labelFull: "Órdenes de compra",
      icon: <ShoppingCart className="w-3.5 h-3.5" />,
    },
    {
      id: "productos" as Tab,
      labelShort: "Productos",
      labelFull: "Gestor de productos",
      icon: <Package className="w-3.5 h-3.5" />,
    },
  ];

  const btnBase = "h-8 gap-1.5 text-xs font-medium border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50";

  return (
    <>
      {/* Search */}
      <div className="ml-auto flex items-center gap-1.5 h-8 pl-3 pr-3 border border-border-subtle dark:border-zinc-700 bg-transparent rounded-lg max-w-72 w-full">
        <Search className="w-3.5 h-3.5 text-content-tertiary dark:text-zinc-500 shrink-0" />
        <input
          type="text"
          value={activeTab === "ordenes" ? ordersSearch : productsSearch}
          onChange={(e) =>
            activeTab === "ordenes"
              ? setOrdersSearch(e.target.value)
              : setProductsSearch(e.target.value)
          }
          placeholder={
            activeTab === "ordenes"
              ? "Buscar por cliente o N° de orden…"
              : "Buscar producto…"
          }
          className="flex-1 min-w-0 text-xs bg-transparent text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* Contextual dropdown */}
      {activeTab === "ordenes" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn(btnBase, "max-w-44 truncate")}>
              <span className="truncate">{statusLabel}</span>
              <span className="ml-auto opacity-50 text-[10px]">▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 dark:bg-zinc-900 dark:border-zinc-800">
            <DropdownMenuRadioGroup
              value={ordersStatus}
              onValueChange={(v) => setOrdersStatus(v as OrderStatus | "todos")}
            >
              {ORDER_STATUS_OPTIONS.map((o) => (
                <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn(btnBase, "max-w-48 truncate")}>
              <span className="truncate 2xl:hidden">{categoryLabelShort}</span>
              <span className="hidden 2xl:inline truncate">{categoryLabelFull}</span>
              <span className="ml-auto opacity-50 text-[10px]">▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800">
            <DropdownMenuRadioGroup
              value={activeCategory ?? "todas"}
              onValueChange={handleCategoryChange}
            >
              {CATEGORY_OPTIONS.map((o) => (
                <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />

      {/* Nuevo producto — only in gestor */}
      {activeTab === "productos" && (
        <>
          {/* Icon-only below 2xl, full button at 2xl+ */}
          <Button
            size="icon"
            onClick={() => window.dispatchEvent(new Event(SHOP_CREATE_EVENT))}
            className="h-8 w-8 bg-gold text-white hover:bg-gold/90 shadow-sm shrink-0 2xl:hidden"
            aria-label="Nuevo producto"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            onClick={() => window.dispatchEvent(new Event(SHOP_CREATE_EVENT))}
            className="hidden 2xl:flex h-8 gap-1.5 text-xs font-medium bg-gold text-white hover:bg-gold/90 shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo producto
          </Button>

          {/* Divider */}
          <div className="w-px h-6 bg-border-subtle dark:bg-zinc-700 shrink-0" />
        </>
      )}

      {/* Tab switcher — 3 tiers: icon-only / short labels / full labels */}
      {/* Below xl: icons only */}
      <div className="flex items-center gap-1 shrink-0 xl:hidden">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            size="icon"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-8 w-8 border-border-subtle dark:border-zinc-700 dark:bg-zinc-800/50",
              activeTab === tab.id &&
                "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100",
            )}
          >
            {tab.icon}
          </Button>
        ))}
      </div>
      {/* xl → 2xl: short labels */}
      <div className="hidden xl:flex 2xl:hidden items-center gap-1 shrink-0">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              btnBase,
              "gap-1.5",
              activeTab === tab.id &&
                "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100",
            )}
          >
            {tab.icon}
            {tab.labelShort}
          </Button>
        ))}
      </div>
      {/* 2xl+: full labels */}
      <div className="hidden 2xl:flex items-center gap-1 shrink-0">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              btnBase,
              "gap-1.5",
              activeTab === tab.id &&
                "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100",
            )}
          >
            {tab.icon}
            {tab.labelFull}
          </Button>
        ))}
      </div>

      {/* Options menu */}
      <ShopMobileControls />
    </>
  );
}
