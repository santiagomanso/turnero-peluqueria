import { create } from "zustand";
import { getMetricsAction } from "@/app/admin/_actions/get-metrics";
import type { Period, PeriodData } from "@/types/metrics";

interface MetricsStore {
  data: Partial<Record<Period, PeriodData>>;
  isLoading: boolean;
  fetch: (period: Period) => Promise<void>;
  refresh: (period: Period) => Promise<void>;
}

export const useMetricsStore = create<MetricsStore>((set, get) => ({
  data: {},
  isLoading: false,

  fetch: async (period: Period) => {
    if (get().data[period]) return; // ya tenemos datos, no fetchear
    set({ isLoading: true });
    const result = await getMetricsAction(period);
    if (result.success) {
      set((s) => ({
        data: { ...s.data, [period]: result.data },
        isLoading: false,
      }));
    } else {
      set({ isLoading: false });
    }
  },

  refresh: async (period: Period) => {
    set({ isLoading: true });
    const result = await getMetricsAction(period);
    if (result.success) {
      set((s) => ({
        data: { ...s.data, [period]: result.data },
        isLoading: false,
      }));
    } else {
      set({ isLoading: false });
    }
  },
}));
