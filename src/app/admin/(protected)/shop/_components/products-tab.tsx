"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getProductsAction } from "../_actions/get-products";
import { deleteProductAction } from "../_actions/delete-product";
import { toggleProductActiveAction } from "../_actions/update-product";
import { SHOP_CATEGORIES, type Product } from "@/types/shop";
import { ProductModal } from "./product-modal";
import { useAsyncData } from "../_hooks/use-async-data";
import Image from "next/image";

interface ProductosTabProps {
  registerOpenCreate?: (fn: () => void) => void;
}

function ProductCard({
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
  return (
    <div
      className={cn(
        "relative rounded-2xl flex flex-col transition-all pt-20",
        "[background:linear-gradient(180deg,#e8c98a_0%,#c9a96e_40%,#7a5c2e_100%)]",
        "shadow-[0_8px_28px_rgba(122,92,46,0.35)]",
        "dark:[background:linear-gradient(135deg,#27272a_0%,#18181b_60%,#1c1810_100%)]",
        "dark:border dark:border-[rgba(201,169,110,0.15)]",
        "dark:shadow-[0_8px_28px_rgba(0,0,0,0.5)]",
        !product.active && "opacity-60",
      )}
    >
      <div className="hidden dark:block absolute -top-8 -right-8 w-24 h-24 rounded-full [background:radial-gradient(circle,rgba(201,169,110,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="absolute top-3 right-3 z-10">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white/20 text-white dark:bg-[rgba(201,169,110,0.15)] dark:text-gold">
          {product.active ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="absolute -top-16 left-0 right-0 h-36 z-20 pointer-events-none">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain drop-shadow-2xl"
          />
        ) : (
          <div className="flex items-end justify-center h-full pb-2">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Package size={24} className="text-white/50" />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-2 flex flex-col gap-3 flex-1">
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-white leading-tight">
            {product.name}
          </p>
          <p className="text-xs mt-1 text-white/70 dark:text-white/40">
            {product.category}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-white dark:text-gold">
            ${product.price.toLocaleString("es-AR")}
          </span>
          <span className="text-xs text-white/60 dark:text-white/30">
            Stock: {product.stock}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/20 dark:border-[rgba(201,169,110,0.15)]">
          <button
            onClick={() => onToggleActive(product)}
            className="flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors text-white/80 hover:bg-white/10 dark:text-white/40 dark:hover:bg-white/5"
          >
            {product.active ? "Desactivar" : "Activar"}
          </button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-white/70 hover:text-white hover:bg-white/10 dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/5"
            onClick={() => onEdit(product)}
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-white/70 hover:text-red-300 hover:bg-white/10 dark:text-white/40 dark:hover:text-red-400 dark:hover:bg-red-950/20"
            onClick={() => onDelete(product)}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductosTab({ registerOpenCreate }: ProductosTabProps) {
  const {
    data: products,
    setData: setProducts,
    isLoading,
  } = useAsyncData<Product>(getProductsAction, "products");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("todas");
  const [modalProduct, setModalProduct] = useState<Product | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    registerOpenCreate?.(() => {
      setModalProduct(undefined);
      setIsModalOpen(true);
    });
  }, [registerOpenCreate]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      filterCategory === "todas" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

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

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${product.name}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    const result = await deleteProductAction(product.id);
    if (!result.success) {
      toast.error(result.error ?? "Error al eliminar el producto");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success("Producto eliminado");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-content-tertiary dark:text-zinc-500 animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900">
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
          <div className="relative">
            <select
              className="appearance-none w-full sm:w-auto rounded-lg border border-border-subtle dark:border-zinc-700 px-3 py-2 pr-8 text-sm cursor-pointer outline-none bg-white dark:bg-zinc-900 text-content dark:text-zinc-100"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              {SHOP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-zinc-500 text-xs">
              ▾
            </div>
          </div>
          <Button
            className="bg-gold text-white hover:bg-gold/90 shrink-0 max-lg:hidden"
            size="sm"
            onClick={handleOpenCreate}
          >
            <Plus size={15} />
            Nuevo producto
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package
              size={36}
              className="mx-auto mb-3 opacity-25 text-content-tertiary dark:text-zinc-500"
            />
            <p className="text-sm text-content-tertiary dark:text-zinc-500">
              {products.length === 0
                ? "Todavía no hay productos. ¡Creá el primero!"
                : "No se encontraron productos"}
            </p>
            {products.length === 0 && (
              <Button
                className="mt-4 bg-gold text-white hover:bg-gold/90"
                size="sm"
                onClick={handleOpenCreate}
              >
                <Plus size={15} />
                Crear producto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleActive={handleToggleActive}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductModal
          product={modalProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
