import { db } from "@/lib/db";
import type { Order, OrderStatus } from "@/types/shop";

function mapOrder(o: {
  id: string;
  name: string | null;
  email: string | null;
  telephone: string;
  note: string | null;
  status: string;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product: { name: string; category: string };
  }[];
}): Order {
  return {
    id: o.id,
    name: o.name,
    email: o.email,
    telephone: o.telephone,
    note: o.note,
    status: o.status as OrderStatus,
    total: o.total,
    createdAt: o.createdAt,
    items: o.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productCategory: item.product.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

const includeItems = {
  items: {
    include: {
      product: { select: { name: true, category: true } },
    },
  },
} as const;

export async function getOrders(): Promise<Order[]> {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: includeItems,
  });
  return orders.map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const o = await db.order.findUnique({
    where: { id },
    include: includeItems,
  });
  if (!o) return null;
  return mapOrder(o);
}

export async function getOrdersByPhone(telephone: string): Promise<Order[]> {
  const orders = await db.order.findMany({
    where: { telephone: { endsWith: telephone.slice(-10) } },
    orderBy: { createdAt: "desc" },
    include: includeItems,
  });
  return orders.map(mapOrder);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  await db.order.update({ where: { id }, data: { status } });
}
