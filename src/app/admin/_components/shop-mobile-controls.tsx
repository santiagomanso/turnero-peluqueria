"use client";

import { useState, useEffect } from "react";
import { Settings2, Plus, Sun, Moon, Tag, RotateCcw, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminTheme } from "./admin-theme-provider";
import { SHOP_CATEGORIES } from "@/types/shop";

export const SHOP_CREATE_EVENT = "shop:open-create";
export const SHOP_REFRESH_EVENT = "shop:refresh";
export const SHOP_ACTIVE_CATEGORY_EVENT = "shop:active-category";
export const SHOP_SELECT_CATEGORY_EVENT = "shop:select-category";
export const SHOP_FILTER_STATUS_EVENT = "shop:filter-status";
export const SHOP_ORDERS_SEARCH_EVENT = "shop:orders-search";
export const SHOP_ORDERS_STATUS_EVENT = "shop:orders-status";
export const SHOP_PRODUCTS_SEARCH_EVENT = "shop:products-search";
export const SHOP_SORT_ORDER_EVENT = "shop:sort-order";

export type StatusFilter = "todos" | "activos" | "inactivos";
export type SortOrder = "newest" | "oldest";

const STATUS_LABELS: Record<StatusFilter, string> = {
  todos: "Todos",
  activos: "Solo activos",
  inactivos: "Solo inactivos",
};

const SORT_LABELS: Record<SortOrder, string> = {
  newest: "Más nuevos primero",
  oldest: "Más viejos primero",
};

export function ShopMobileControls() {
  const { isDark, toggle } = useAdminTheme();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [gestorActive, setGestorActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    function handle(e: Event) {
      const detail = (
        e as CustomEvent<{ category: string | null; gestorActive: boolean; statusFilter: StatusFilter; sortOrder?: SortOrder }>
      ).detail;
      setActiveCategory(detail.category);
      setGestorActive(detail.gestorActive);
      setStatusFilter(detail.statusFilter ?? "todos");
      setSortOrder(detail.sortOrder ?? "newest");
    }
    window.addEventListener(SHOP_ACTIVE_CATEGORY_EVENT, handle);
    return () => window.removeEventListener(SHOP_ACTIVE_CATEGORY_EVENT, handle);
  }, []);

  function selectCategory(cat: string | null) {
    window.dispatchEvent(
      new CustomEvent(SHOP_SELECT_CATEGORY_EVENT, {
        detail: { category: cat },
      }),
    );
  }

  function selectStatus(value: string) {
    window.dispatchEvent(
      new CustomEvent(SHOP_FILTER_STATUS_EVENT, {
        detail: { statusFilter: value as StatusFilter },
      }),
    );
  }

  function selectSortOrder(value: string) {
    window.dispatchEvent(
      new CustomEvent(SHOP_SORT_ORDER_EVENT, {
        detail: { sortOrder: value as SortOrder },
      }),
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg h-9 w-9">
          <Settings2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 dark:bg-zinc-900 dark:border-zinc-800"
      >
        <DropdownMenuItem
          onClick={() => window.dispatchEvent(new Event(SHOP_CREATE_EVENT))}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-gold" />
          Nuevo producto
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => window.dispatchEvent(new Event(SHOP_REFRESH_EVENT))}
          className="flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-content-tertiary dark:text-zinc-400" />
          Actualizar
        </DropdownMenuItem>

        {gestorActive && (
          <>
            <DropdownMenuSeparator className="dark:bg-zinc-800" />
            <DropdownMenuLabel className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
              Categoría
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                <Tag className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="truncate text-sm">
                  {activeCategory === null
                    ? "Categorías"
                    : activeCategory === "todas"
                      ? "Todos los productos"
                      : activeCategory}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52 dark:bg-zinc-900 dark:border-zinc-800 max-h-72 overflow-y-auto">
                <DropdownMenuRadioGroup
                  value={activeCategory ?? ""}
                  onValueChange={selectCategory}
                >
                  <DropdownMenuRadioItem value="todas" className="text-xs">
                    Todos los productos
                  </DropdownMenuRadioItem>
                  {SHOP_CATEGORIES.map((cat) => (
                    <DropdownMenuRadioItem
                      key={cat}
                      value={cat}
                      className="text-xs"
                    >
                      {cat}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator className="dark:bg-zinc-800" />
            <DropdownMenuLabel className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
              Filtros
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5 text-content-tertiary dark:text-zinc-400 shrink-0" />
                <span className="truncate text-sm">
                  Estado
                  {statusFilter !== "todos" && (
                    <span className="ml-1 text-[0.6rem] text-gold font-semibold">·</span>
                  )}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-44 dark:bg-zinc-900 dark:border-zinc-800">
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={selectStatus}
                >
                  {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((key) => (
                    <DropdownMenuRadioItem key={key} value={key} className="text-xs">
                      {STATUS_LABELS[key]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                <ArrowUpDown className="w-3.5 h-3.5 text-content-tertiary dark:text-zinc-400 shrink-0" />
                <span className="truncate text-sm">
                  Ordenar
                  {sortOrder !== "newest" && (
                    <span className="ml-1 text-[0.6rem] text-gold font-semibold">·</span>
                  )}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48 dark:bg-zinc-900 dark:border-zinc-800">
                <DropdownMenuRadioGroup
                  value={sortOrder}
                  onValueChange={selectSortOrder}
                >
                  {(Object.keys(SORT_LABELS) as SortOrder[]).map((key) => (
                    <DropdownMenuRadioItem key={key} value={key} className="text-xs">
                      {SORT_LABELS[key]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator className="dark:bg-zinc-800" />
        <DropdownMenuItem
          onClick={toggle}
          className="flex items-center gap-2 cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5" />
          ) : (
            <Moon className="w-3.5 h-3.5" />
          )}
          {isDark ? "Modo claro" : "Modo oscuro"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
