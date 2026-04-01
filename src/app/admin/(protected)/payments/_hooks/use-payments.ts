"use client";

import { create } from "zustand";
import {
  getUnifiedPaymentsAction,
  type UnifiedPaymentRow,
} from "@/app/admin/_actions/get-payments";

interface PaymentsStore {
  cache: Record<string, UnifiedPaymentRow[]>;
  isLoading: boolean;
  fetchPayments: (date: string) => Promise<void>;
  refreshPayments: (date: string) => Promise<void>;
}

export const usePayments = create<PaymentsStore>((set, get) => ({
  cache: {},
  isLoading: false,

  fetchPayments: async (date: string) => {
    if (get().cache[date] !== undefined) return;
    set({ isLoading: true });
    const result = await getUnifiedPaymentsAction(date);
    if (result.success) {
      set((state) => ({ cache: { ...state.cache, [date]: result.data } }));
    }
    set({ isLoading: false });
  },

  refreshPayments: async (date: string) => {
    set({ isLoading: true });
    const result = await getUnifiedPaymentsAction(date);
    if (result.success) {
      set((state) => ({ cache: { ...state.cache, [date]: result.data } }));
    }
    set({ isLoading: false });
  },
}));
