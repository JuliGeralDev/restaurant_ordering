"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { apiRequest } from "@/shared/lib/api/httpClient";

export function useGetRequest<TData>(
  url: string,
  initialData: TData,
  options?: {
    enabled?: boolean;
  }
) {
  const enabled = options?.enabled ?? true;
  const initialDataRef = useRef(initialData);
  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState("");

  const getData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      setError("");
      setData(initialDataRef.current);
      return initialDataRef.current;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await apiRequest<TData>({
        method: "GET",
        url,
      });

      setData(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, url]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setError("");
      setData(initialDataRef.current);
      return;
    }

    void getData();
  }, [enabled, getData]);

  return {
    data,
    error,
    isLoading,
    getData,
  };
}
