import { db } from "@/lib/db";
import type { Order, OrderStatus, PaymentMethod } from "@/types/shop";
import { sendOrderReadyNotification } from "@/services/whatsapp";

function mapOrder(o: {
  id: string;
  name: string | null;
  email: string | null;
  telephone: string;
  note: string | null;
  status: string;
  paymentMethod: string;
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
    paymentMethod: o.paymentMethod as PaymentMethod,
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
  const order = await db.order.findUnique({
    where: { id },
    select: { telephone: true, paymentMethod: true, total: true, name: true },
  });
  if (!order) throw new Error("Orden no encontrada");

  await db.order.update({ where: { id }, data: { status } });

  // READY → notify customer (fire-and-forget; never blocks the response)
  if (status === "READY") {
    sendOrderReadyNotification({
      telephone: order.telephone,
      orderId: id,
      customerName: order.name ?? "Cliente",
    }).catch(
      (err) => console.error("[updateOrderStatus] WhatsApp notification failed:", err),
    );
  }

  // PICKED_UP + cash payment → record the payment
  if (status === "PICKED_UP" && order.paymentMethod === "local") {
    await db.payment.upsert({
      where: { orderId: id },
      create: {
        type: "shop_order",
        source: "cash",
        amount: order.total,
        status: "approved",
        orderId: id,
      },
      update: {},
    });
  }

  // Reverting away from PICKED_UP → remove the cash payment record (if any)
  if (status !== "PICKED_UP") {
    await db.payment.deleteMany({ where: { orderId: id, source: "cash" } });
  }
}

// ─── Validate cart ─────────────────────────────────────────────────────────────

export interface CartValidationItem {
  productId: string;
  quantity: number;
}

export interface CartValidationResult {
  valid: boolean;
  /** Products that are inactive or don't exist */
  inactive: { productId: string; name: string }[];
  /** Products with insufficient stock */
  outOfStock: { productId: string; name: string; available: number; requested: number }[];
}

export async function validateCart(
  items: CartValidationItem[],
): Promise<CartValidationResult> {
  const productIds = items.map((i) => i.productId);

  // Fetch ALL products (including inactive) to distinguish inactive vs missing
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, stock: true, active: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const inactive: CartValidationResult["inactive"] = [];
  const outOfStock: CartValidationResult["outOfStock"] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    if (!product || !product.active) {
      inactive.push({
        productId: item.productId,
        name: product?.name ?? "Producto desconocido",
      });
      continue;
    }

    if (product.stock < item.quantity) {
      outOfStock.push({
        productId: item.productId,
        name: product.name,
        available: product.stock,
        requested: item.quantity,
      });
    }
  }

  return {
    valid: inactive.length === 0 && outOfStock.length === 0,
    inactive,
    outOfStock,
  };
}

// ─── Create order ──────────────────────────────────────────────────────────────

export interface CreateOrderInput {
  telephone: string;
  name: string;
  email?: string;
  note?: string;
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // Fetch products to validate & get current prices
  const productIds = input.items.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    const foundIds = new Set(products.map((p) => p.id));
    const missing = productIds.filter((id) => !foundIds.has(id));
    throw new Error(
      `Productos no encontrados o inactivos: ${missing.join(", ")}`,
    );
  }

  // Validate stock
  const productMap = new Map(products.map((p) => [p.id, p]));
  for (const item of input.items) {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      throw new Error(
        `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`,
      );
    }
  }

  // Calculate total from real DB prices (never trust the client)
  const total = input.items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  // Create order + items + decrement stock in a single transaction
  const order = await db.$transaction(async (tx) => {
    // Decrement stock for each product
    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Create order with items
    return tx.order.create({
      data: {
        telephone: input.telephone,
        name: input.name,
        email: input.email ?? null,
        note: input.note ?? null,
        paymentMethod: input.paymentMethod,
        total,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: includeItems,
    });
  });

  return mapOrder(order);
}
