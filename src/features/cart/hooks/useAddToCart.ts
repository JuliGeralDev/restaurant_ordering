"use client";

import { useState } from "react";
import { apiRequest } from "@/shared/lib/api/httpClient";
import { useCartStore } from "@/shared/stores/cartStore";
import type { AddToCartRequest, AddToCartResponse, Modifier, OrderResponse } from "../cart.types";

const CART_ITEMS_ENDPOINT = "/cart/items";

export function useAddToCart() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { orderId, userId, setOrderId, setOrderData } = useCartStore();

  const addToCart = async (productId: string, quantity: number = 1, selectedModifiers?: Modifier[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: AddToCartRequest = {
        userId,
        productId,
        quantity,
      };

      if (orderId) {
        payload.orderId = orderId;
      }

      if (selectedModifiers) {
        payload.modifiers = selectedModifiers;
      }

      const response = await apiRequest<AddToCartResponse, AddToCartRequest>({
        method: "POST",
        url: CART_ITEMS_ENDPOINT,
        data: payload,
      });

      setOrderId(response.orderId);

      // Fetch fresh order data and push it to the store so all consumers update
      const orderData = await apiRequest<OrderResponse>({
        method: "GET",
        url: `/orders/${response.orderId}`,
      });
      setOrderData(orderData);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add item to cart";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToCart,
    isLoading,
    error,
  };
}
