"use client";

import { useState, useCallback, useEffect } from "react";
import { toZonedTime } from "date-fns-tz";
import type { Appointment } from "@/types/appointment";
import { getAppointmentsByDateAction } from "../_actions/get-by-date";

const TZ = "America/Argentina/Buenos_Aires";

export function useAdminAppointments() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    toZonedTime(new Date(), TZ),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchAppointments = useCallback(async (date: Date) => {
    setIsLoading(true);
    setHasFetched(false);

    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);

    const result = await getAppointmentsByDateAction(normalized);
    if (result.success) {
      setAppointments(result.data);
    } else {
      setAppointments([]);
    }
    setIsLoading(false);
    setHasFetched(true);
  }, []);

  // Cargar turnos de hoy al montar
  useEffect(() => {
    fetchAppointments(toZonedTime(new Date(), TZ));
  }, [fetchAppointments]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setIsCalendarOpen(false);
    fetchAppointments(date);
  };

  const handleRefresh = () => {
    fetchAppointments(selectedDate);
  };

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    selectedDate,
    isCalendarOpen,
    setIsCalendarOpen,
    appointments,
    isLoading,
    hasFetched,
    handleDateSelect,
    handleRefresh,
    handleDelete,
  };
}
