"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  ChevronDown,
  ChevronRight,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getProductsAction } from "../_actions/get-products";
import { deleteProductAction } from "../_actions/delete-product";
import { toggleProductActiveAction } from "../_actions/update-product";
import { SHOP_CATEGORIES, type ShopCategory, type Product } from "@/types/shop";
import { ProductModal } from "./product-modal";
import { useAsyncData } from "../_hooks/use-async-data";
import {
  SHOP_ACTIVE_CATEGORY_EVENT,
  SHOP_SELECT_CATEGORY_EVENT,
} from "@/app/admin/_components/shop-mobile-controls";
import Image from "next/image";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProductosTabProps {
  registerOpenCreate?: (fn: () => void) => void;
}

// ─── Category visual styles ──────────────────────────────────────────────────

type CatSize = "xl" | "wide" | "sm";

const CAT_STYLE: Record<
  ShopCategory,
  {
    bg: string;
    accentText: string;
    accentBg: string;
    emoji: string;
    gradient: string;
    size: CatSize;
  }
> = {
  "Shampoo y Acondicionador": {
    bg: "bg-violet-100 dark:bg-violet-950",
    accentText: "text-violet-700 dark:text-violet-300",
    accentBg: "bg-violet-500/15 border border-violet-500/30",
    emoji: "💧",
    gradient: "from-violet-400/40 via-purple-300/20 to-transparent",
    size: "xl",
  },
  "Mascarillas y Baños de Crema": {
    bg: "bg-rose-100 dark:bg-rose-950",
    accentText: "text-rose-700 dark:text-rose-300",
    accentBg: "bg-rose-500/15 border border-rose-500/30",
    emoji: "🫙",
    gradient: "from-rose-400/40 via-pink-300/20 to-transparent",
    size: "sm",
  },
  "Tratamientos Capilares": {
    bg: "bg-amber-100 dark:bg-amber-950",
    accentText: "text-amber-700 dark:text-amber-300",
    accentBg: "bg-amber-500/15 border border-amber-500/30",
    emoji: "✨",
    gradient: "from-amber-400/40 via-yellow-300/20 to-transparent",
    size: "sm",
  },
  "Aceites y Serums": {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    accentText: "text-emerald-700 dark:text-emerald-300",
    accentBg: "bg-emerald-500/15 border border-emerald-500/30",
    emoji: "🌿",
    gradient: "from-emerald-400/40 via-green-300/20 to-transparent",
    size: "wide",
  },
  "Protectores y Sprays": {
    bg: "bg-sky-100 dark:bg-sky-950",
    accentText: "text-sky-700 dark:text-sky-300",
    accentBg: "bg-sky-500/15 border border-sky-500/30",
    emoji: "💨",
    gradient: "from-sky-400/40 via-blue-300/20 to-transparent",
    size: "wide",
  },
  "Cremas para Peinar": {
    bg: "bg-teal-100 dark:bg-teal-950",
    accentText: "text-teal-700 dark:text-teal-300",
    accentBg: "bg-teal-500/15 border border-teal-500/30",
    emoji: "🪄",
    gradient: "from-teal-400/40 via-cyan-300/20 to-transparent",
    size: "sm",
  },
  Accesorios: {
    bg: "bg-orange-100 dark:bg-orange-950",
    accentText: "text-orange-700 dark:text-orange-300",
    accentBg: "bg-orange-500/15 border border-orange-500/30",
    emoji: "🪮",
    gradient: "from-orange-400/40 via-amber-300/20 to-transparent",
    size: "sm",
  },
};

const SIZE_COL: Record<CatSize, string> = {
  xl: "col-span-2",
  wide: "col-span-2",
  sm: "col-span-1",
};

// ─── Categories bento grid ──────────────────────────────────────────────────

function AdminCategoriesBento({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (cat: string) => void;
}) {
  const counts = useMemo(
    () =>
      SHOP_CATEGORIES.reduce(
        (acc, cat) => ({
          ...acc,
          [cat]: products.filter((p) => p.category === cat).length,
        }),
        {} as Record<string, number>,
      ),
    [products],
  );

  return (
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ gridAutoRows: "160px" }}>
        {/* Todos los productos */}
        <button
          onClick={() => onSelect("todas")}
          className="col-span-2 rounded-2xl px-5 py-4 text-left flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 active:scale-[0.98] transition-transform"
        >
          <div>
            <p className="text-sm font-extrabold text-content dark:text-zinc-100">
              Todos los productos
            </p>
            <p className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 uppercase tracking-wider mt-0.5">
              Ver todos
            </p>
          </div>
          <span className="text-lg font-black text-content-secondary dark:text-zinc-400">
            {products.length}
          </span>
        </button>
        {SHOP_CATEGORIES.map((cat) => {
          const style = CAT_STYLE[cat];
          const count = counts[cat] ?? 0;

          if (style.size === "xl") {
            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={cn(
                  SIZE_COL.xl,
                  "relative rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform border border-border-subtle dark:border-zinc-800 cursor-pointer",
                  style.bg,
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-60",
                    style.gradient,
                  )}
                />
                <div className="relative h-full flex flex-col p-5 gap-2">
                  <div className="flex items-start justify-between">
                    <span className="text-5xl select-none">{style.emoji}</span>
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full border",
                        style.accentBg,
                        style.accentText,
                      )}
                    >
                      {count} {count === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight flex-1">
                    {cat}
                  </h3>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold",
                      style.accentText,
                    )}
                  >
                    Ver productos
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          }

          if (style.size === "wide") {
            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={cn(
                  SIZE_COL.wide,
                  "relative rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform border border-border-subtle dark:border-zinc-800 cursor-pointer",
                  style.bg,
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-50",
                    style.gradient,
                  )}
                />
                <div className="relative h-full flex items-center gap-4 px-5">
                  <span className="text-4xl select-none shrink-0">
                    {style.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-extrabold text-content dark:text-zinc-100 leading-tight">
                      {cat}
                    </h3>
                    <p
                      className={cn(
                        "text-xs font-semibold mt-1",
                        style.accentText,
                      )}
                    >
                      Ver productos →
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold px-2.5 py-1 rounded-full border shrink-0",
                      style.accentBg,
                      style.accentText,
                    )}
                  >
                    {count} {count === 1 ? "producto" : "productos"}
                  </span>
                </div>
              </button>
            );
          }

          // sm
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                SIZE_COL.sm,
                "relative rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform border border-border-subtle dark:border-zinc-800 cursor-pointer",
                style.bg,
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-50",
                  style.gradient,
                )}
              />
              <div className="relative h-full flex flex-col p-4 justify-between">
                <div>
                  <span className="text-3xl select-none block mb-2">
                    {style.emoji}
                  </span>
                  <h3 className="text-sm font-extrabold text-content dark:text-zinc-100 leading-tight">
                    {cat}
                  </h3>
                </div>
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-full border self-start",
                    style.accentBg,
                    style.accentText,
                  )}
                >
                  {count} {count === 1 ? "producto" : "productos"}
                </span>
              </div>
            </button>
          );
        })}
        {/* /Per-category grid */}
      </div>
    </div>
  );
}

// ─── Admin product card ─────────────────────────────────────────────────────

function AdminProductCard({
  product,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  product: Product;
  onToggleActive: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const priceFormatted = `$${product.price.toLocaleString("es-AR")}`;

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden flex flex-col shadow-sm bg-white dark:bg-zinc-900 ring-2 h-full",
        "ring-border-subtle dark:ring-zinc-800",
        !product.active && "grayscale opacity-70",
      )}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
        {product.featured && product.active && (
          <span className="flex items-center gap-1 bg-amber-400/90 text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shadow">
            <Star className="w-2.5 h-2.5 fill-white" />
            Destacado
          </span>
        )}
        {!product.active && (
          <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
            Inactivo
          </span>
        )}
      </div>

      {/* Image */}
      <div className="bg-surface dark:bg-zinc-800 aspect-4/3 flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <Package
            size={28}
            className="text-content-quaternary dark:text-zinc-600 opacity-40"
          />
        )}
        <span className="absolute bottom-2 right-2 text-[0.5rem] font-medium bg-white/80 dark:bg-zinc-900/80 text-content-secondary dark:text-zinc-400 px-1.5 py-0.5 rounded-full">
          Stock: {product.stock}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <div className="flex-1 mt-5">
          <p className="text-xs font-bold text-content dark:text-zinc-100 leading-tight">
            {product.name}
          </p>
          {product.description && (
            <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-500 mt-0.5 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <span className="text-sm font-extrabold text-content dark:text-zinc-100">
          {priceFormatted}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1.5 border-t border-border-subtle dark:border-zinc-800">
          <button
            onClick={() => onToggleActive(product)}
            className="flex-1 text-[0.6rem] font-medium py-1 rounded-lg text-content-secondary dark:text-zinc-400 hover:bg-surface dark:hover:bg-zinc-800 transition-colors"
          >
            {product.active ? "Desactivar" : "Activar"}
          </button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-100"
            onClick={() => onEdit(product)}
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-content-tertiary dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400"
            onClick={() => onDelete(product)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Category filter dropdown ───────────────────────────────────────────────

function CategoryFilter({
  value,
  onChange,
  placeholder = "Todas las categorías",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="justify-between gap-2 font-normal min-w-45 sm:min-w-50"
        >
          <span className="truncate">
            {value === "todas" ? placeholder : value}
          </span>
          <ChevronDown size={14} className="shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-55">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="todas">
            {placeholder}
          </DropdownMenuRadioItem>
          {SHOP_CATEGORIES.map((cat) => (
            <DropdownMenuRadioItem key={cat} value={cat}>
              {cat}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ProductosTab({ registerOpenCreate }: ProductosTabProps) {
  const {
    data: products,
    setData: setProducts,
    isLoading,
  } = useAsyncData<Product>(getProductsAction, "products");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    registerOpenCreate?.(() => {
      setModalProduct(undefined);
      setIsModalOpen(true);
    });
  }, [registerOpenCreate]);

  // Notify options menu: we're in gestor + current category
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(SHOP_ACTIVE_CATEGORY_EVENT, {
        detail: { category: selectedCategory, gestorActive: true },
      }),
    );
  }, [selectedCategory]);

  // On unmount, hide the category section from the options menu
  useEffect(() => {
    return () => {
      window.dispatchEvent(
        new CustomEvent(SHOP_ACTIVE_CATEGORY_EVENT, {
          detail: { category: null, gestorActive: false },
        }),
      );
    };
  }, []);

  // Listen for category selection from options menu
  useEffect(() => {
    function handle(e: Event) {
      const { category } = (e as CustomEvent<{ category: string | null }>)
        .detail;
      setSelectedCategory(category);
      setSearch("");
    }
    window.addEventListener(SHOP_SELECT_CATEGORY_EVENT, handle);
    return () => window.removeEventListener(SHOP_SELECT_CATEGORY_EVENT, handle);
  }, []);

  // Filter products by selected category + search
  const filtered =
    selectedCategory === null
      ? []
      : products.filter(
          (p) =>
            (selectedCategory === "todas" ||
              p.category === selectedCategory) &&
            p.name.toLowerCase().includes(search.toLowerCase()),
        );

  function handleOpenCreate() {
    setModalProduct(undefined);
    setIsModalOpen(true);
  }

  function handleOpenEdit(product: Product) {
    setModalProduct(product);
    setIsModalOpen(true);
  }

  function handleSave(saved: Product) {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) return prev.map((p) => (p.id === saved.id ? saved : p));
      return [saved, ...prev];
    });
  }

  async function handleToggleActive(product: Product) {
    const result = await toggleProductActiveAction(product.id);
    if (!result.success || !result.product) {
      toast.error(result.error ?? "Error al cambiar el estado");
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? result.product! : p)),
    );
    toast.success(
      result.product.active ? "Producto activado" : "Producto desactivado",
    );
  }

  function handleDelete(product: Product) {
    setDeleteTarget(product);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteProductAction(deleteTarget.id);
    setIsDeleting(false);
    if (!result.success) {
      toast.error(result.error ?? "Error al eliminar el producto");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success("Producto eliminado");
    setDeleteTarget(null);
  }

  // When the dropdown selects a category, navigate into it (same as bento click)
  function handleDropdownCategory(value: string) {
    setSelectedCategory(value);
    setSearch("");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {selectedCategory === null ? (
        /* ── Categories bento view ───────────────────────────────── */
        <>
          {/* Filter bar */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 rounded-md px-3 h-9 border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <Search
                size={15}
                className="text-content-tertiary dark:text-zinc-500 shrink-0"
              />
              <input
                className="flex-1 bg-transparent text-sm outline-none text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value.length > 0) {
                    setSelectedCategory("todas");
                  }
                }}
              />
            </div>
            <CategoryFilter
              value="todas"
              onChange={handleDropdownCategory}
            />
            <Button
              className="bg-gold text-white hover:bg-gold/90 shrink-0"
              onClick={handleOpenCreate}
            >
              <Plus size={15} />
              Nuevo producto
            </Button>
          </div>

          <AdminCategoriesBento
            products={products}
            onSelect={(cat) => {
              setSelectedCategory(cat);
              setSearch("");
            }}
          />
        </>
      ) : (
        /* ── Product grid for selected category ─────────────────── */
        <>
          {/* Fixed header — breadcrumb + search + count */}
          <div className="shrink-0 space-y-3 mb-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[0.65rem] text-content-tertiary dark:text-zinc-500">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearch("");
                }}
                className="hover:text-gold transition-colors"
              >
                Productos
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-content dark:text-zinc-300 font-medium">
                {selectedCategory === "todas"
                  ? "Todos los productos"
                  : selectedCategory}
              </span>
            </div>

            {/* Search + category dropdown + nuevo producto */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 rounded-md px-3 h-9 border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <Search
                  size={15}
                  className="text-content-tertiary dark:text-zinc-500 shrink-0"
                />
                <input
                  className="flex-1 bg-transparent text-sm outline-none text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <CategoryFilter
                value={selectedCategory}
                onChange={handleDropdownCategory}
              />
              <Button
                className="bg-gold text-white hover:bg-gold/90 shrink-0"
                onClick={handleOpenCreate}
              >
                <Plus size={15} />
                Nuevo producto
              </Button>
            </div>

            {/* Product count */}
            <p className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 uppercase tracking-widest">
              {filtered.length} producto
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Scrollable product grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <Package
                size={36}
                className="text-content-quaternary dark:text-zinc-600 opacity-25"
              />
              <p className="text-sm text-content-tertiary dark:text-zinc-500 text-center">
                {products.length === 0
                  ? "Todavía no hay productos. ¡Creá el primero!"
                  : "No se encontraron productos"}
              </p>
              {products.length === 0 && (
                <Button
                  className="bg-gold text-white hover:bg-gold/90"
                  size="sm"
                  onClick={handleOpenCreate}
                >
                  <Plus size={15} />
                  Crear producto
                </Button>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((product) => (
                  <AdminProductCard
                    key={product.id}
                    product={product}
                    onToggleActive={handleToggleActive}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-content dark:text-zinc-100">
              ¿Eliminar producto?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-content-tertiary dark:text-zinc-500">
              Esta acción no se puede deshacer. El producto{" "}
              <span className="font-semibold text-content dark:text-zinc-300">
                &quot;{deleteTarget?.name}&quot;
              </span>{" "}
              será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white! dark:bg-zinc-800! border border-border-subtle dark:border-zinc-700 text-content-secondary dark:text-zinc-400 hover:bg-black/5! dark:hover:bg-zinc-700!">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-linear-to-br from-rose-400 to-red-800 border border-danger-border text-white hover:bg-danger-soft/80!"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={modalProduct}
        onSave={handleSave}
      />
    </div>
  );
}
