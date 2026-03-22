"use client";

import { useEffect } from "react";
import { apiRequest } from "@/shared/lib/api/httpClient";
import { useCartStore } from "@/shared/stores/cartStore";
import type { OrderResponse } from "../cart.types";

export function useGetOrder() {
  const { orderId, orderData, setOrderData } = useCartStore();

  const fetchOrder = (id: string) => {
    apiRequest<OrderResponse>({ method: "GET", url: `/orders/${id}` })
      .then(setOrderData)
      .catch(() => {});
  };

  // Always fetch fresh from server on mount when there's an orderId
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  return {
    data: orderData,
    refetch: () => { if (orderId) fetchOrder(orderId); },
  };
}
