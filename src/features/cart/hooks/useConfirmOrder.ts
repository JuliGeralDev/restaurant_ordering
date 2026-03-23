"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  ConfirmOrderRequest,
  ConfirmOrderResponse,
} from "@/features/cart/cart.types";
import { apiRequest } from "@/shared/lib/api/httpClient";
import { useCartStore } from "@/shared/stores/cartStore";

export function useConfirmOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { orderId, userId, clearOrder, getOrCreateCheckoutIdempotencyKey } =
    useCartStore();

  const confirmOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const idempotencyKey = getOrCreateCheckoutIdempotencyKey(orderId);

      await apiRequest<ConfirmOrderResponse, ConfirmOrderRequest>({
        method: "POST",
        url: "/orders",
        data: { orderId, userId },
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      });

      clearOrder();
      router.push(`/orders/${orderId}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to confirm order";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { confirmOrder, isLoading, error };
}
