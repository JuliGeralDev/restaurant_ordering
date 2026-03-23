"use client";

import type {
  AddToCartRequest,
  Modifier,
} from "@/features/cart/cart.types";
import { addItemToCartRequest } from "@/features/cart/cart.api";
import { useCartActionState } from "@/features/cart/hooks/useCartActionState";
import { useCartOrderSync } from "@/features/cart/hooks/useCartOrderSync";
import { useCartStore } from "@/shared/stores/cartStore";

export function useAddToCart() {
  const { syncOrder } = useCartOrderSync();
  const { isLoading, error, run } = useCartActionState(
    "Failed to add item to cart"
  );

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    selectedModifiers?: Modifier[]
  ) =>
    run(async () => {
      const { orderId, userId } = useCartStore.getState();

      if (!userId) {
        throw new Error("Sign in before adding items to the cart.");
      }

      const payload: AddToCartRequest = {
        userId,
        productId,
        quantity,
        ...(orderId ? { orderId } : {}),
        ...(selectedModifiers ? { modifiers: selectedModifiers } : {}),
      };

      const response = await addItemToCartRequest(payload);
      await syncOrder(response.orderId);

      return response;
    });

  return {
    addToCart,
    isLoading,
    error,
  };
}
