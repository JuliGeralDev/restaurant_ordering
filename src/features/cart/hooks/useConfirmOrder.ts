"use client";

import { useRouter } from "next/navigation";

import type {
  ConfirmOrderRequest,
} from "@/features/cart/cart.types";
import { confirmOrderRequest } from "@/features/cart/cart.api";
import { useCartActionState } from "@/features/cart/hooks/useCartActionState";
import { useCartStore } from "@/shared/stores/cartStore";

export function useConfirmOrder() {
  const router = useRouter();
  const { isLoading, error, run } = useCartActionState(
    "Failed to confirm order"
  );
  const { orderId, userId, clearOrder, getOrCreateCheckoutIdempotencyKey } =
    useCartStore();

  const confirmOrder = async () => {
    if (!orderId) return;

    return run(async () => {
      const idempotencyKey = getOrCreateCheckoutIdempotencyKey(orderId);
      const payload: ConfirmOrderRequest = { orderId, userId };

      await confirmOrderRequest(payload, idempotencyKey);
      clearOrder();
      router.push(`/orders/${orderId}`);
    });
  };

  return { confirmOrder, isLoading, error };
}
