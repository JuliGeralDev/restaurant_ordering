"use client";

import { useGetRequest } from "@/shared/hooks/useGetRequest";
import { useCartStore } from "@/shared/stores/cartStore";
import type { OrderResponse } from "@/features/cart/cart.types";

export function useGetOrdersByUser() {
  const userId = useCartStore((s) => s.userId);
  return useGetRequest<OrderResponse[]>(`/orders?userId=${userId}`, []);
}
