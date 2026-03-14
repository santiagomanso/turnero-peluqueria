"use client";

import { ImagePlus, Loader2, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SHOP_CATEGORIES, type Product } from "@/types/shop";
import { useCreateProductForm } from "../_hooks/use-create-product-form";
import NextImage from "next/image";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSave: (product: Product) => void;
}

export function ProductModal({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductModalProps) {
  const onClose = () => onOpenChange(false);

  const {
    form,
    isEditing,
    isUploading,
    isSaving,
    preview,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
    triggerFileInput,
    onSubmit,
  } = useCreateProductForm({ product, onSave, onClose });

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const inputClass =
    "w-full rounded-lg border border-border-subtle dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-content dark:text-zinc-100 placeholder:text-content-tertiary dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all";

  const labelClass =
    "block text-xs font-semibold text-content-secondary dark:text-zinc-400 mb-1.5";

  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg max-h-[92svh] p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="px-5 py-4 border-b border-[#e8e4df] dark:border-zinc-800">
          <DialogTitle>
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4 scrollbar-none">
          {/* Image */}
          <div>
            <label className={labelClass}>Imagen del producto</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-[#e8e4df] dark:border-zinc-700 bg-surface dark:bg-zinc-800 h-48">
                <NextImage
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain p-2"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <Loader2 size={24} className="text-white animate-spin" />
                    <p className="text-white text-xs font-medium">
                      Procesando con IA...
                    </p>
                  </div>
                )}
                {!isUploading && (
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <Button
                      size="icon-xs"
                      variant="outline"
                      className="bg-white/90 dark:bg-zinc-800/90"
                      onClick={triggerFileInput}
                    >
                      <ImagePlus size={12} />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="outline"
                      className="bg-white/90 dark:bg-zinc-800/90 text-red-500 hover:text-red-600"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full rounded-xl border-2 border-dashed border-[#e8e4df] dark:border-zinc-700 flex flex-col items-center justify-center py-8 gap-2 hover:border-gold/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <ImagePlus size={18} className="text-gold" />
                </div>
                <p className="text-sm font-medium text-content-secondary dark:text-zinc-400">
                  Subir imagen del producto
                </p>
                <p className="text-xs text-content-tertiary dark:text-zinc-500">
                  Se procesará automáticamente con IA
                </p>
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              {...register("name")}
              className={cn(
                inputClass,
                errors.name &&
                  "border-red-400 focus:border-red-400 focus:ring-red-400/20",
              )}
              placeholder="Ej: Shampoo hidratante 500ml"
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              {...register("description")}
              className={cn(
                inputClass,
                "resize-none",
                errors.description &&
                  "border-red-400 focus:border-red-400 focus:ring-red-400/20",
              )}
              placeholder="Descripción breve del producto..."
              rows={3}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Precio (ARS) *</label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                min={0}
                className={cn(
                  inputClass,
                  errors.price &&
                    "border-red-400 focus:border-red-400 focus:ring-red-400/20",
                )}
                placeholder="0"
              />
              {errors.price && (
                <p className={errorClass}>{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                min={0}
                className={cn(
                  inputClass,
                  errors.stock &&
                    "border-red-400 focus:border-red-400 focus:ring-red-400/20",
                )}
                placeholder="0"
              />
              {errors.stock && (
                <p className={errorClass}>{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Categoría</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between gap-2 font-normal"
                >
                  <span className="truncate">{watch("category")}</span>
                  <ChevronDown size={14} className="shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuRadioGroup
                  value={watch("category")}
                  onValueChange={(v) => setValue("category", v as typeof SHOP_CATEGORIES[number])}
                >
                  {SHOP_CATEGORIES.map((cat) => (
                    <DropdownMenuRadioItem key={cat} value={cat}>
                      {cat}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.category && (
              <p className={errorClass}>{errors.category.message}</p>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-surface dark:bg-zinc-800 border border-[#e8e4df] dark:border-zinc-700">
            <div>
              <p className="text-sm font-medium text-content dark:text-zinc-100">
                Producto activo
              </p>
              <p className="text-xs mt-0.5 text-content-tertiary dark:text-zinc-500">
                Si está inactivo no aparece en la tienda
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("active", !watch("active"))}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
                watch("active") ? "bg-gold" : "bg-zinc-300 dark:bg-zinc-600",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                  watch("active") ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t border-[#e8e4df] dark:border-zinc-800 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSaving || isUploading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-gold text-white hover:bg-gold/90"
            onClick={onSubmit}
            disabled={isSaving || isUploading}
          >
            {isSaving
              ? isEditing
                ? "Guardando..."
                : "Creando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
