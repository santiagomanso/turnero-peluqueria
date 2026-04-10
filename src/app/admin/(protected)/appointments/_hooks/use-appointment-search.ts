"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Appointment } from "@/types/appointment";
import { searchAppointmentsAction } from "../_actions/search-appointments";
import { useAdminAppointments } from "./use-appointments";

const MIN_CHARS = 5;
const DEBOUNCE_MS = 300;

export function useAppointmentSearch() {
  const { searchQuery: query, setSearchQuery } = useAdminAppointments();
  const [results, setResults] = useState<Appointment[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Normal typing: update query + debounce DB fetch
  const handleQueryChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < MIN_CHARS) {
        setResults([]);
        setIsOpen(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        const result = await searchAppointmentsAction(value.trim());
        setResults(result.success ? result.data : []);
        setIsOpen(true);
        setIsSearching(false);
      }, DEBOUNCE_MS);
    },
    [setSearchQuery],
  );

  // Autocomplete on result click: set full identifier, no new DB fetch, close dropdown
  const setQueryDirect = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchQuery(value);
      setResults([]);
      setIsOpen(false);
      setIsSearching(false);
    },
    [setSearchQuery],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    results,
    isSearching,
    isOpen,
    handleQueryChange,
    setQueryDirect,
    close,
  };
}
