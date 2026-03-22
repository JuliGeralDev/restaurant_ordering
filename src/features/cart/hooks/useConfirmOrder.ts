"use client";

import { useState } from "react";
import { apiRequest } from "@/shared/lib/api/httpClient";
import { useCartStore } from "@/shared/stores/cartStore";

export function useConfirmOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { orderId, clearOrder } = useCartStore();

  const confirmOrder = async () => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiRequest<void>({ method: "GET", url: `/orders/${orderId}` });
      clearOrder();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to confirm order";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { confirmOrder, isLoading, error };
}
