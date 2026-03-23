"use client";

import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "@/shared/lib/api/httpClient";

export function useGetRequest<TData>(
  url: string,
  initialData: TData
) {
  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = useCallback(async () => {
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
  }, [url]);

  useEffect(() => {
    void getData();
  }, [getData]);

  return {
    data,
    error,
    isLoading,
    getData,
  };
}
