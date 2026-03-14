import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createProductAction } from "../_actions/create-product";
import { updateProductAction } from "../_actions/update-product";
import { SHOP_CATEGORIES, type Product } from "@/types/shop";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  category: z.enum([...SHOP_CATEGORIES], {
    message: "Seleccioná una categoría válida",
  }),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface UseProductFormProps {
  open: boolean;
  product?: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export function useCreateProductForm({
  open,
  product,
  onSave,
  onClose,
}: UseProductFormProps) {
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: SHOP_CATEGORIES[0] as (typeof SHOP_CATEGORIES)[number],
      active: true,
    },
  });

  // Reset form and image state every time the dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price ?? 0,
        stock: product?.stock ?? 0,
        category: (product?.category ??
          SHOP_CATEGORIES[0]) as (typeof SHOP_CATEGORIES)[number],
        active: product?.active ?? true,
      });
      setImageUrl(product?.imageUrl ?? null);
      setPreview(product?.imageUrl ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setImageUrl(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Error al subir la imagen");
      }

      setImageUrl(data.url);
      setPreview(data.url);
      toast.success("Imagen procesada con IA correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al subir la imagen",
      );
      setPreview(product?.imageUrl ?? null);
      setImageUrl(product?.imageUrl ?? null);
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    setPreview(null);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (isUploading) {
      toast.error("Esperá a que termine de procesar la imagen");
      return;
    }

    const result = isEditing
      ? await updateProductAction(product.id, {
          name: values.name,
          description: values.description || null,
          price: values.price,
          stock: values.stock,
          category: values.category,
          active: values.active,
          imageUrl,
        })
      : await createProductAction({
          name: values.name,
          description: values.description || undefined,
          price: values.price,
          stock: values.stock,
          category: values.category,
          active: values.active,
          imageUrl: imageUrl ?? undefined,
        });

    if (!result.success || !result.product) {
      toast.error(result.error ?? "Error al guardar el producto");
      return;
    }

    toast.success(isEditing ? "Producto actualizado" : "Producto creado");
    onSave(result.product);
    onClose();
  });

  return {
    form,
    isEditing,
    isUploading,
    isSaving: form.formState.isSubmitting,
    preview,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
    triggerFileInput,
    onSubmit,
  };
}
