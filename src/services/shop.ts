import { db } from "@/lib/db";
import type { Product } from "@/types/shop";

function mapProduct(p: {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: Date;
}): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    category: p.category,
    imageUrl: p.imageUrl,
    active: p.active,
    createdAt: p.createdAt,
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await db.product.findMany({
    where: { active: true, stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = await db.product.findUnique({ where: { id } });
  if (!p) return null;
  return mapProduct(p);
}

export async function createProduct(input: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  active: boolean;
}): Promise<Product> {
  const p = await db.product.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      stock: input.stock,
      category: input.category,
      imageUrl: input.imageUrl ?? null,
      active: input.active,
    },
  });
  return mapProduct(p);
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category: string;
    imageUrl: string | null;
    active: boolean;
  }>,
): Promise<Product> {
  const p = await db.product.update({
    where: { id },
    data: input,
  });
  return mapProduct(p);
}

export async function deleteProduct(id: string): Promise<void> {
  const itemCount = await db.orderItem.count({ where: { productId: id } });
  if (itemCount > 0) {
    throw new Error(
      "No podés eliminar un producto que tiene órdenes asociadas.",
    );
  }
  await db.product.delete({ where: { id } });
}

export async function toggleProductActive(id: string): Promise<Product> {
  const p = await db.product.findUniqueOrThrow({ where: { id } });
  return updateProduct(id, { active: !p.active });
}
