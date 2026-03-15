"use client";

import { useState, useEffect } from "react";
import { Settings2, Plus, Sun, Moon, Tag } from "lucide-react";
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
export const SHOP_ACTIVE_CATEGORY_EVENT = "shop:active-category";
export const SHOP_SELECT_CATEGORY_EVENT = "shop:select-category";

export function ShopMobileControls() {
  const { isDark, toggle } = useAdminTheme();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [gestorActive, setGestorActive] = useState(false);

  useEffect(() => {
    function handle(e: Event) {
      const detail = (
        e as CustomEvent<{ category: string | null; gestorActive: boolean }>
      ).detail;
      setActiveCategory(detail.category);
      setGestorActive(detail.gestorActive);
    }
    window.addEventListener(SHOP_ACTIVE_CATEGORY_EVENT, handle);
    return () => window.removeEventListener(SHOP_ACTIVE_CATEGORY_EVENT, handle);
  }, []);

  function selectCategory(cat: string | null) {
    window.dispatchEvent(
      new CustomEvent(SHOP_SELECT_CATEGORY_EVENT, { detail: { category: cat } }),
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
                    <DropdownMenuRadioItem key={cat} value={cat} className="text-xs">
                      {cat}
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
