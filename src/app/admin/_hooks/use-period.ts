"use client";

import { create } from "zustand";

type Period = "week" | "month" | "year";

interface PeriodStore {
  period: Period;
  setPeriod: (p: Period) => void;
}

export const usePeriod = create<PeriodStore>((set) => ({
  period: "week",
  setPeriod: (period) => set({ period }),
}));
