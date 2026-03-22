"use client";

import { useState } from "react";
import { apiRequest } from "@/shared/lib/api/httpClient";
import { useCartStore } from "@/shared/stores/cartStore";
import type { RemoveCartItemRequest, OrderResponse } from "../cart.types";

const CART_ITEMS_ENDPOINT = "/cart/items";

export function useRemoveCartItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { orderId, userId, setOrderData } = useCartStore();

  const doRemove = async (cartItemId?: string, productId?: string) => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload: RemoveCartItemRequest = {
        orderId,
        userId,
        ...(cartItemId ? { cartItemId } : {}),
        ...(productId ? { productId } : {}),
      };
      await apiRequest<void, RemoveCartItemRequest>({ method: "DELETE", url: CART_ITEMS_ENDPOINT, data: payload });
      const orderData = await apiRequest<OrderResponse>({ method: "GET", url: `/orders/${orderId}` });
      setOrderData(orderData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item from cart";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = (cartItemId: string) => doRemove(cartItemId);
  const removeAllItems = (productId: string) => doRemove(undefined, productId);

  return { removeCartItem, removeAllItems, isLoading, error };
}
