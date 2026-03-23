"use client";

import { useGetRequest } from "@/shared/hooks/useGetRequest";
import { useCartStore } from "@/shared/stores/cartStore";
import type { OrderResponse } from "@/features/cart/cart.types";

export function useGetOrdersByUser() {
  const userId = useCartStore((s : any) => s.userId as string | null);
  return useGetRequest<OrderResponse[]>(`/orders?userId=${userId ?? ""}`, [], {
    enabled: Boolean(userId),
  });
}
