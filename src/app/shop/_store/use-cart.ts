import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/shop";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string;
  quantity: number;
}

interface CartStore {
  // Items
  items: CartItem[];
  toggle: (product: Product) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  inCart: (id: string) => boolean;
  totalItems: () => number;
  totalPrice: () => number;

  // Snapshot of the last completed order (persisted so success screen can read it)
  lastOrder: CartItem[] | null;
  saveLastOrder: () => void;

  // Drawer state (not persisted)
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      // ─── Items ──────────────────────────────────────────────────────────────

      items: [],

      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === product.id);
          if (exists) {
            return { items: state.items.filter((i) => i.id !== product.id) };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
                quantity: 1,
              },
            ],
          };
        }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decrement: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          if (item.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          };
        }),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),

      inCart: (id) => get().items.some((i) => i.id === id),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      // ─── Last order snapshot ─────────────────────────────────────────────────

      lastOrder: null,

      saveLastOrder: () => set((state) => ({ lastOrder: [...state.items] })),

      // ─── Drawer ─────────────────────────────────────────────────────────────

      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "shop-cart",
      partialize: (state) => ({
        items: state.items,
        lastOrder: state.lastOrder,
      }),
    },
  ),
);
