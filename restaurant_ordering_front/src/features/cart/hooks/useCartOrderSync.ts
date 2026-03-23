"use client";

import { useCallback } from "react";

import { fetchOrderById } from "@/features/cart/cart.api";
import { useCartStore } from "@/shared/stores/cartStore";

export function useCartOrderSync() {
  const { setOrderData, setOrderId } = useCartStore();

  const refreshOrder = useCallback(async (orderId: string) => {
    const orderData = await fetchOrderById(orderId);
    setOrderData(orderData);
    return orderData;
  }, [setOrderData]);

  const syncOrder = useCallback(async (orderId: string) => {
    setOrderId(orderId);
    return refreshOrder(orderId);
  }, [refreshOrder, setOrderId]);

  return {
    refreshOrder,
    syncOrder,
  };
}
