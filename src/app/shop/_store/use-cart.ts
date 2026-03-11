import { create } from "zustand";

interface CartStore {
  cart: number[];
  addToCart: (id: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  cart: [],
  addToCart: (id) => set((state) => ({ cart: [...state.cart, id] })),
  clearCart: () => set({ cart: [] }),
}));
