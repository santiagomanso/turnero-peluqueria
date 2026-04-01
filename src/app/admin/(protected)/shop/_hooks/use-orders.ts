"use client";

import { create } from "zustand";
import { type Order, type OrderStatus } from "@/types/shop";
import { getOrdersAction } from "../_actions/get-orders";

interface OrdersStore {
  orders: Order[];
  nextCursor: string | null;
  hasFetched: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  fetchOrders: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  loadMore: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrders = create<OrdersStore>((set, get) => ({
  orders: [],
  nextCursor: null,
  hasFetched: false,
  isLoading: false,
  isLoadingMore: false,

  fetchOrders: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true });
    const result = await getOrdersAction();
    if (result.success && result.orders) {
      set({ orders: result.orders, nextCursor: result.nextCursor ?? null, hasFetched: true });
    }
    set({ isLoading: false });
  },

  refreshOrders: async () => {
    set({ isLoading: true });
    const result = await getOrdersAction();
    if (result.success && result.orders) {
      set({ orders: result.orders, nextCursor: result.nextCursor ?? null, hasFetched: true });
    }
    set({ isLoading: false });
  },

  loadMore: async () => {
    const { nextCursor, isLoadingMore } = get();
    if (!nextCursor || isLoadingMore) return;
    set({ isLoadingMore: true });
    const result = await getOrdersAction(nextCursor);
    if (result.success && result.orders) {
      set((state) => ({
        orders: [...state.orders, ...result.orders!],
        nextCursor: result.nextCursor ?? null,
      }));
    }
    set({ isLoadingMore: false });
  },

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));
