import { create } from "zustand";
import { getConfigAction } from "@/app/admin/_actions/get-config";
import type { ConfigData } from "@/types/config";

interface ConfigStore {
  data: ConfigData | null;
  hasFetched: boolean;
  isLoading: boolean;
  fetch: () => Promise<void>;
  update: (data: ConfigData) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  data: null,
  hasFetched: false,
  isLoading: false,

  fetch: async () => {
    if (get().hasFetched) return; // ya tenemos datos, no fetchear
    set({ isLoading: true });
    const result = await getConfigAction();
    if (result.success) {
      set({ data: result.data, hasFetched: true, isLoading: false });
    } else {
      set({ hasFetched: true, isLoading: false });
    }
  },

  update: (data: ConfigData) => set({ data }),
}));
