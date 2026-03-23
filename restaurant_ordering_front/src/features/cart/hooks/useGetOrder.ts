"use client";

import { useEffect } from "react";

import { useCartOrderSync } from "@/features/cart/hooks/useCartOrderSync";
import { useCartStore } from "@/shared/stores/cartStore";

export function useGetOrder() {
  const { orderId, orderData } = useCartStore();
  const { refreshOrder } = useCartOrderSync();

  useEffect(() => {
    if (!orderId) return;

    refreshOrder(orderId).catch(() => {});
  }, [orderId, refreshOrder]);

  return {
    data: orderData,
    refetch: () => {
      if (!orderId) return Promise.resolve(undefined);
      return refreshOrder(orderId);
    },
  };
}
