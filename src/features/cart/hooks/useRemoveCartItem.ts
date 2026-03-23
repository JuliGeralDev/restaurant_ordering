"use client";

import type { RemoveCartItemRequest } from "@/features/cart/cart.types";
import { removeCartItemRequest } from "@/features/cart/cart.api";
import { useCartActionState } from "@/features/cart/hooks/useCartActionState";
import { useCartOrderSync } from "@/features/cart/hooks/useCartOrderSync";
import { useCartStore } from "@/shared/stores/cartStore";

export function useRemoveCartItem() {
  const { orderId, userId } = useCartStore();
  const { refreshOrder } = useCartOrderSync();
  const { isLoading, error, run } = useCartActionState(
    "Failed to remove item from cart"
  );

  const doRemove = async (cartItemId?: string, productId?: string) => {
    if (!orderId) return;

    return run(async () => {
      const payload: RemoveCartItemRequest = {
        orderId,
        userId,
        ...(cartItemId ? { cartItemId } : {}),
        ...(productId ? { productId } : {}),
      };

      await removeCartItemRequest(payload);
      await refreshOrder(orderId);
    });
  };

  const removeCartItem = (cartItemId: string) => doRemove(cartItemId);
  const removeAllItems = (productId: string) => doRemove(undefined, productId);

  return {
    removeCartItem,
    removeAllItems,
    isLoading,
    error,
  };
}
