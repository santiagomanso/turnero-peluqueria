export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "READY"
  | "PICKED_UP"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  name: string | null;
  email: string | null;
  telephone: string;
  note: string | null;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: Date;
}

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pendiente", color: "#b45309", bg: "#fef3c7" },
  PROCESSING: { label: "Preparando pedido", color: "#1d4ed8", bg: "#dbeafe" },
  READY: { label: "Listo para retirar", color: "#7c3aed", bg: "#ede9fe" },
  PICKED_UP: { label: "Retirado", color: "#15803d", bg: "#dcfce7" },
  CANCELLED: { label: "Cancelado", color: "#b91c1c", bg: "#fee2e2" },
};

export const SHOP_CATEGORIES = [
  "Shampoo y Acondicionador",
  "Mascarillas y Baños de Crema",
  "Tratamientos Capilares",
  "Aceites y Serums",
  "Protectores y Sprays",
  "Cremas para Peinar",
  "Accesorios",
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];
