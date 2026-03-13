"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for fetching async data with loading state.
 *
 * @param fetcher   - server action that returns an object with a `success` flag
 * @param dataKey   - the key in the result that holds the data array
 *
 * @example
 * const { data, setData, isLoading } = useAsyncData(getProductsAction, "products");
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncData<T>(
  fetcher: () => Promise<Record<string, any>>,
  dataKey: string,
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await fetcher();
    if (result.success && result[dataKey]) {
      setData(result[dataKey] as T[]);
    }
    setIsLoading(false);
  }, [fetcher, dataKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, isLoading, refresh: load };
}
