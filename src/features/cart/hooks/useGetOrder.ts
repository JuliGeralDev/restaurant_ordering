"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/shared/lib/api/httpClient";
import { useCartStore } from "@/shared/stores/cartStore";
import type { OrderResponse } from "../cart.types";

export function useGetOrder() {
  const { orderId } = useCartStore();
  const [data, setData] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<OrderResponse>({
        method: "GET",
        url: `/orders/${id}`,
      });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      void fetchOrder(orderId);
    } else {
      setData(null);
    }
  }, [orderId]);

  return {
    data,
    isLoading,
    error,
    refetch: () => { if (orderId) void fetchOrder(orderId); },
  };
}
