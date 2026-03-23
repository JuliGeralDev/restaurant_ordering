"use client";

import { useGetRequest } from "@/shared/hooks/useGetRequest";
import type { OrderResponse } from "@/features/cart/cart.types";

export function useGetOrderById(orderId: string) {
  return useGetRequest<OrderResponse | null>(`/orders/${orderId}`, null);
}
