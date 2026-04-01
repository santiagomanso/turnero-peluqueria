"use client";

import { create } from "zustand";
import { type Product } from "@/types/shop";
import { getProductsAction } from "../_actions/get-products";

interface ProductsStore {
  products: Product[];
  hasFetched: boolean;
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  setProducts: (updater: (prev: Product[]) => Product[]) => void;
}

export const useProducts = create<ProductsStore>((set, get) => ({
  products: [],
  hasFetched: false,
  isLoading: false,

  fetchProducts: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true });
    const result = await getProductsAction();
    if (result.success && result.products) {
      set({ products: result.products, hasFetched: true });
    }
    set({ isLoading: false });
  },

  refreshProducts: async () => {
    set({ isLoading: true });
    const result = await getProductsAction();
    if (result.success && result.products) {
      set({ products: result.products, hasFetched: true });
    }
    set({ isLoading: false });
  },

  setProducts: (updater) =>
    set((state) => ({ products: updater(state.products) })),
}));
