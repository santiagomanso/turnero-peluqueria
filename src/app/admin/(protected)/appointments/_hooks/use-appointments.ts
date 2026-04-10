"use client";

import { create } from "zustand";
import { toZonedTime } from "date-fns-tz";
import type { Appointment } from "@/types/appointment";
import { getAppointmentsByDateAction } from "../_actions/get-by-date";
import { getMonthlyAppointmentCountsAction } from "@/app/appointments/_actions/get-monthly-counts";

const TZ = "America/Argentina/Buenos_Aires";

interface AdminAppointmentsStore {
  selectedDate: Date;
  appointments: Appointment[];
  isLoading: boolean;
  hasFetched: boolean;
  showCancelled: boolean;
  monthlyCounts: Record<string, number>;
  isLoadingCounts: boolean;
  /** Current value of the global search input */
  searchQuery: string;
  /** ID of the appointment the user last clicked in search results */
  highlightedAppointmentId: string | null;
  fetchAppointments: (date: Date) => Promise<void>;
  fetchMonthlyCounts: (year: number, month: number) => Promise<void>;
  handleDateSelect: (date: Date | undefined) => void;
  handleRefresh: () => void;
  handleDelete: (id: string) => void;
  toggleShowCancelled: () => void;
  setSearchQuery: (q: string) => void;
  setHighlightedAppointmentId: (id: string | null) => void;
}

export const useAdminAppointments = create<AdminAppointmentsStore>(
  (set, get) => ({
    selectedDate: toZonedTime(new Date(), TZ),
    appointments: [],
    isLoading: false,
    hasFetched: false,
    showCancelled: false,
    monthlyCounts: {},
    isLoadingCounts: false,
    searchQuery: "",
    highlightedAppointmentId: null,

    fetchAppointments: async (date: Date) => {
      set({ isLoading: true, hasFetched: false });

      const normalized = new Date(date);
      normalized.setUTCHours(0, 0, 0, 0);

      const result = await getAppointmentsByDateAction(
        normalized,
        get().showCancelled,
      );
      set({
        appointments: result.success ? result.data : [],
        isLoading: false,
        hasFetched: true,
      });
    },

    fetchMonthlyCounts: async (year: number, month: number) => {
      set({ isLoadingCounts: true });
      const counts = await getMonthlyAppointmentCountsAction(year, month);
      set({ monthlyCounts: counts, isLoadingCounts: false });
    },

    handleDateSelect: (date) => {
      if (!date) return;
      set({ selectedDate: date });
      get().fetchAppointments(date);
    },

    handleRefresh: () => {
      get().fetchAppointments(get().selectedDate);
    },

    handleDelete: (id) => {
      set((state) => ({
        appointments: state.appointments.filter((a) => a.id !== id),
      }));
    },

    toggleShowCancelled: () => {
      set((state) => ({ showCancelled: !state.showCancelled }));
      get().fetchAppointments(get().selectedDate);
    },

    setSearchQuery: (q) => set({ searchQuery: q }),
    setHighlightedAppointmentId: (id) => set({ highlightedAppointmentId: id }),
  }),
);
