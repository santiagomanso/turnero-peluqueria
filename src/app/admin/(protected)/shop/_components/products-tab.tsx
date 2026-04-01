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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { deleteProductAction } from "../_actions/delete-product";
import { toggleProductActiveAction } from "../_actions/update-product";
import { SHOP_CATEGORIES, type Product } from "@/types/shop";
import { ProductModal } from "./product-modal";
import { useProducts } from "../_hooks/use-products";
import {
  SHOP_ACTIVE_CATEGORY_EVENT,
  SHOP_SELECT_CATEGORY_EVENT,
  SHOP_FILTER_STATUS_EVENT,
  type StatusFilter,
} from "@/app/admin/_components/shop-mobile-controls";
import Image from "next/image";
import ShopCategoriesBento from "@/app/shop/_components/shop-categories-bento";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProductosTabProps {
  registerOpenCreate?: (fn: () => void) => void;
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
            className="object-contain"
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
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-border-subtle dark:border-zinc-800">
          <div className="flex items-center gap-1.5 flex-1">
            <Switch
              size="sm"
              checked={product.active}
              onCheckedChange={() => onToggleActive(product)}
              className="data-[state=checked]:bg-blue-500"
            />
            <span className="text-[0.6rem] font-medium text-content-secondary dark:text-zinc-400">
              {product.active ? "Activo" : "Inactivo"}
            </span>
          </div>
          <button
            onClick={() => onEdit(product)}
            className="flex items-center justify-center h-7 w-7 rounded-md border border-border-subtle dark:border-zinc-700 text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-100 hover:bg-surface dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex items-center justify-center h-7 w-7 rounded-md border border-border-subtle dark:border-zinc-700 text-content-tertiary dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <Trash2 size={13} />
          </button>
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

// ─── Search bar ─────────────────────────────────────────────────────────────

function SearchBar({
  search,
  onSearch,
  className,
}: {
  search: string;
  onSearch: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900",
        className,
      )}
    >
      <Search size={15} className="text-content-tertiary dark:text-zinc-500 shrink-0" />
      <input
        className="flex-1 bg-transparent text-sm outline-none text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      {search.trim().length > 0 && (
        <button onClick={() => onSearch("")}>
          <X size={14} className="text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300 transition-colors" />
        </button>
      )}
    </div>
  );
}

// ─── Product grid ───────────────────────────────────────────────────────────

function ProductGrid({
  items,
  totalProducts,
  onToggleActive,
  onEdit,
  onDelete,
  onOpenCreate,
}: {
  items: Product[];
  totalProducts: number;
  onToggleActive: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onOpenCreate: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <Package
          size={36}
          className="text-content-quaternary dark:text-zinc-600 opacity-25"
        />
        <p className="text-sm text-content-tertiary dark:text-zinc-500 text-center">
          {totalProducts === 0
            ? "Todavía no hay productos. ¡Creá el primero!"
            : "No se encontraron productos"}
        </p>
        {totalProducts === 0 && (
          <Button
            className="bg-gold text-white hover:bg-gold/90"
            size="sm"
            onClick={onOpenCreate}
          >
            <Plus size={15} />
            Crear producto
          </Button>
        )}
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto pb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onToggleActive={onToggleActive}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Counter ─────────────────────────────────────────────────────────────────

function Counter({
  count,
  statusFilter,
}: {
  count: number;
  statusFilter: StatusFilter;
}) {
  return (
    <p className="text-[0.65rem] text-content-tertiary dark:text-zinc-500 uppercase tracking-widest">
      {count} producto{count !== 1 ? "s" : ""}
      {statusFilter !== "todos" && (
        <span className="ml-1.5 normal-case">· {statusFilter}</span>
      )}
    </p>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ProductosTab({ registerOpenCreate }: ProductosTabProps) {
  const { products, setProducts, isLoading, fetchProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [modalProduct, setModalProduct] = useState<Product | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Counts per category for the bento grid
  const categoryCounts = useMemo(
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    registerOpenCreate?.(() => {
      setModalProduct(undefined);
      setIsModalOpen(true);
    });
  }, [registerOpenCreate]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(SHOP_ACTIVE_CATEGORY_EVENT, {
        detail: {
          category: selectedCategory,
          gestorActive: true,
          statusFilter,
        },
      }),
    );
  }, [selectedCategory, statusFilter]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(
        new CustomEvent(SHOP_ACTIVE_CATEGORY_EVENT, {
          detail: { category: null, gestorActive: false },
        }),
      );
    };
  }, []);

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

  useEffect(() => {
    function handle(e: Event) {
      const { statusFilter } = (
        e as CustomEvent<{ statusFilter: StatusFilter }>
      ).detail;
      setStatusFilter(statusFilter);
    }
    window.addEventListener(SHOP_FILTER_STATUS_EVENT, handle);
    return () => window.removeEventListener(SHOP_FILTER_STATUS_EVENT, handle);
  }, []);

  const isSearching = search.trim().length > 0;

  const applyStatusFilter = (p: Product) =>
    statusFilter === "todos" ||
    (statusFilter === "activos" ? p.active : !p.active);

  const globalResults = isSearching
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          applyStatusFilter(p),
      )
    : [];

  const filtered =
    selectedCategory === null
      ? []
      : products.filter(
          (p) =>
            (selectedCategory === "todas" || p.category === selectedCategory) &&
            applyStatusFilter(p),
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
    // Optimistic update — flip immediately so the switch feels instant
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)),
    );
    const result = await toggleProductActiveAction(product.id);
    if (!result.success || !result.product) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, active: product.active } : p,
        ),
      );
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
    <div className="h-full flex flex-col gap-3">

      {/* ── Controles — siempre visibles ── */}
      <div className="shrink-0">
        {/* Desktop: una sola fila */}
        <div className="hidden sm:flex gap-2 items-center">
          <SearchBar search={search} onSearch={setSearch} className="flex-1" />
          <CategoryFilter
            value={selectedCategory ?? "todas"}
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
        {/* Mobile: solo search */}
        <div className="sm:hidden">
          <SearchBar search={search} onSearch={setSearch} />
        </div>
      </div>

      {/* ── Contenido ── */}
      {isSearching ? (
        /* Resultados de búsqueda global */
        <>
          <Counter count={globalResults.length} statusFilter={statusFilter} />
          <div className="flex-1 flex flex-col min-h-0">
            <ProductGrid
              items={globalResults}
              totalProducts={products.length}
              onToggleActive={handleToggleActive}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onOpenCreate={handleOpenCreate}
            />
          </div>
        </>
      ) : selectedCategory === null ? (
        /* Bento de categorías */
        <div className="flex-1 overflow-y-auto pb-6">
          <button
            onClick={() => handleDropdownCategory("todas")}
            className="w-full col-span-2 rounded-2xl px-5 py-4 mb-3 text-left flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 active:scale-[0.98] transition-transform"
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
          <ShopCategoriesBento
            categoryCounts={categoryCounts}
            onSelect={(cat) => setSelectedCategory(cat)}
          />
        </div>
      ) : (
        /* Grid de productos de la categoría seleccionada */
        <>
          <div className="shrink-0 space-y-1">
            <div className="flex items-center gap-1.5 text-[0.65rem] text-content-tertiary dark:text-zinc-500">
              <button
                onClick={() => setSelectedCategory(null)}
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
            <Counter count={filtered.length} statusFilter={statusFilter} />
          </div>
          <ProductGrid
            items={filtered}
            totalProducts={products.length}
            onToggleActive={handleToggleActive}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onOpenCreate={handleOpenCreate}
          />
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
