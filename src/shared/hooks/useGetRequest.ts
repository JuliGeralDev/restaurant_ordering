"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/shared/lib/api/httpClient";

export function useGetRequest<TData>(
  url: string,
  initialData: TData
) {
  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiRequest<TData>({
        method: "GET",
        url,
      });

      setData(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocurrio un error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void getData();
  }, [url]);

  return {
    data,
    error,
    isLoading,
    getData,
  };
}
